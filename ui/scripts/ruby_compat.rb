if !File.respond_to?(:exists?)
  class << File
    alias exists? exist?
  end
end