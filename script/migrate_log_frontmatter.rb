#!/usr/bin/env ruby
# frozen_string_literal: true

# One-time migration: lift entry metadata out of the markdown body into front matter.
#
# Before:
#   ---
#   title: "The Odyssey"
#   rating: "5"
#   ---
#
#   ### 🌊 [The Odyssey](https://imdb.com/…) / Best film of the year <small class="superscript">🔥</small>
#
#   > Nolan takes the oldest story…
#
# After:
#   ---
#   title: "The Odyssey"
#   rating: 5
#   icon: "🌊"
#   verdict: "Best film of the year"
#   highlight: true
#   link: https://imdb.com/…
#   ---
#
#   > Nolan takes the oldest story…
#
# Idempotent: entries that already carry `verdict` or `link` are skipped.
# Usage: ruby script/migrate_log_frontmatter.rb [--dry-run]

require 'yaml'
require 'date'

DRY_RUN = ARGV.include?('--dry-run')
LOGS_DIR = File.expand_path('../_logs', __dir__)

# Emoji ranges wide enough for every glyph used in the collection:
# flags (1F1E6–1F1FF), pictographs (1F300–1FAFF), dingbats and misc symbols
# (2600–27BF), arrows (2190–21FF), plus the variation selector.
EMOJI = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}]\u{FE0F}?/.freeze
EMOJI_ONLY = /\A(?:#{EMOJI}|\s)+\z/.freeze
REDUNDANT_RATING = %r{\A\d+(?:\.\d+)?/5\z}.freeze
FLAME = "\u{1F525}"

# Ratings agreed with the author for the four entries that stored an emoji
# where a number belongs.
RATING_OVERRIDES = {
  '2025-09-26-ghost-of-yotai-game-log.md' => 4.5,
  '2025-11-07-phoenician-scheme-movie-log.md' => 5,
  '2025-02-01-sa-movie-log.md' => 5,
  '2024-12-15-level-movie-log.md' => 4
}.freeze

TYPO_FIXES = {
  'Masterpice' => 'Masterpiece',
  'Grate' => 'Great',
  'Greate' => 'Great'
}.freeze

# Field order in the rewritten front matter.
KEY_ORDER = %w[layout title date category rating icon verdict tag highlight link link_label images].freeze

def split_front_matter(text)
  match = text.match(/\A---\s*\n(.*?)\n---\s*\n(.*)\z/m)
  raise "no front matter" unless match

  [YAML.safe_load(match[1], permitted_classes: [Date]), match[2]]
end

# Pulls every <small class="superscript">…</small> out of the line.
def extract_superscripts(line)
  supers = line.scan(%r{<small class="superscript">(.*?)</small>}m).flatten.map(&:strip)
  [line.gsub(%r{\s*<small class="superscript">.*?</small>}m, ''), supers]
end

# "A Mind-Bending Thriller 🧠" -> "🧠 A Mind-Bending Thriller"
def move_trailing_emoji_to_front(text)
  match = text.match(/\A(.*?)\s*((?:#{EMOJI})+)\z/)
  return text unless match && !match[1].empty?

  "#{match[2]} #{match[1]}"
end

def fix_typos(text)
  TYPO_FIXES.reduce(text) { |acc, (from, to)| acc.gsub(/\b#{from}\b/, to) }
end

# Parses "### 🌊 [Title](url) / Verdict" into its parts.
def parse_heading(line)
  rest, supers = extract_superscripts(line.sub(/\A###\s*/, ''))

  link = rest.match(/\[([^\]]*)\]\(([^)]+)\)/)
  raise "no link in heading: #{line}" unless link

  before = rest[0...link.begin(0)].strip
  after = rest[link.end(0)..].strip
  link_text = link[1].strip

  highlight = false
  icon = nil

  # Leading emoji before the link — 🔥 there means "memorable", not an icon.
  if before == FLAME
    highlight = true
  elsif !before.empty? && before.match?(EMOJI_ONLY)
    icon = before
  end

  # Ghost of Yotei keeps its emoji inside the link text: [⚔️ Ghost of Yotei](…)
  if (inner = link_text.match(/\A((?:#{EMOJI})+)\s+(.+)\z/))
    icon ||= inner[1]
  end

  verdict = after.sub(%r{\A/\s*}, '').strip
  verdict = nil if verdict.empty?

  # Superscripts: "4/5" duplicates `rating`, a lone 🔥 is the highlight flag,
  # anything else is a tag.
  emoji_tags = []
  text_tags = []
  supers.each do |sup|
    next if sup.match?(REDUNDANT_RATING)

    if sup.include?(FLAME)
      highlight = true
      sup = sup.gsub(FLAME, '').strip
      next if sup.empty?
    end

    (sup.match?(EMOJI_ONLY) ? emoji_tags : text_tags) << sup
  end

  tag = (emoji_tags + text_tags.map { |t| move_trailing_emoji_to_front(t) }).join(' ').strip
  tag = nil if tag.empty?

  { icon: icon, link: link[2].strip, verdict: verdict, tag: tag, highlight: highlight }
end

def derive_link_label(url)
  case url
  when /imdb\.com/ then 'IMDb'
  when /opencritic\.com/ then 'OpenCritic'
  when /maps\.app\.goo\.gl|google\.[a-z.]+\/maps/ then 'Maps'
  end
end

def normalize_rating(value, filename)
  override = RATING_OVERRIDES[filename]
  return override if override
  return nil if value.nil?

  number = value.to_s.strip
  return nil unless number.match?(/\A\d+(?:\.\d+)?\z/)

  float = number.to_f
  float == float.to_i ? float.to_i : float
end

def yaml_quote(value)
  %("#{value.to_s.gsub('\\', '\\\\\\\\').gsub('"', '\"')}")
end

def render_front_matter(data)
  quoted = %w[title icon verdict tag]
  lines = []

  (KEY_ORDER + (data.keys - KEY_ORDER)).uniq.each do |key|
    next unless data.key?(key)

    value = data[key]
    next if value.nil?

    if value.is_a?(Array)
      lines << "#{key}:"
      value.each { |item| lines << " - #{item}" }
    elsif quoted.include?(key)
      lines << "#{key}: #{yaml_quote(value)}"
    else
      lines << "#{key}: #{value}"
    end
  end

  lines.join("\n")
end

def migrate(path)
  filename = File.basename(path)
  text = File.read(path)
  front, body = split_front_matter(text)

  return [:skipped, nil] if front.key?('verdict') || front.key?('link')

  heading_line = body.lines.find { |line| line.start_with?('### ') }

  parsed = heading_line ? parse_heading(fix_typos(heading_line.chomp)) : {}
  body = body.sub(heading_line, '') if heading_line

  front['rating'] = normalize_rating(front['rating'], filename)
  front['icon'] = parsed[:icon]
  front['verdict'] = parsed[:verdict]
  front['tag'] = parsed[:tag]
  front['highlight'] = true if parsed[:highlight]
  front['link'] = parsed[:link]

  if parsed[:link] && derive_link_label(parsed[:link]).nil?
    front['link_label'] = 'Link'
  end

  front.delete('permalink')

  rendered = "---\n#{render_front_matter(front)}\n---\n\n#{body.sub(/\A\s*\n+/, '')}"
  rendered = rendered.rstrip + "\n"

  [:migrated, rendered]
end

changed = 0
skipped = 0

Dir.glob(File.join(LOGS_DIR, '*.md')).sort.each do |path|
  status, rendered = migrate(path)

  if status == :skipped
    skipped += 1
    next
  end

  original = File.read(path)
  if original == rendered
    skipped += 1
    next
  end

  changed += 1

  if DRY_RUN
    puts "═══ #{File.basename(path)}"
    puts rendered.lines.take_while { |line| !line.start_with?('>') }.join
  else
    File.write(path, rendered)
  end
end

puts "#{DRY_RUN ? '[dry-run] ' : ''}migrated: #{changed}, unchanged: #{skipped}"
