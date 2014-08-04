# -*- encoding : utf-8 -*-
class KMLConverter
  include Sidekiq::Worker

  def perform(type, path)
    kml = File.read(path)
    case type
    when 'Objects::Path::Line' then Objects::Path::Line.from_kml(kml)
    when 'Objects::Line' then Objects::Line.from_kml(kml)
    when 'Objects::Tower' then Objects::Tower.from_kml(kml)
    end
    Sys::Cache.clear_map_objects
  end
end
