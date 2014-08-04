class Sys::Cache
  include Mongoid::Document

  field :name, type: String
  field :content, type: String

  index(name: 1)

  def self.get_map_objects
    cache = Sys::Cache.where(name: 'map-all-objects').first
    cache.content if cache
  end

  def self.set_map_objects(text)
    cache = Sys::Cache.where(name: 'map-all-objects').first || Sys::Cache.new(name: 'map-all-objects')
    cache.content = text
    cache.save
  end
end
