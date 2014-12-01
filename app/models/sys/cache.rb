module Sys::Cache
  PATHPOINTS = 'pathpoints'
  MAPOBJECTS = 'mapobjects'
  PHOTOS = 'photos'

  def pathpoints
    pathpoints = Rails.cache.read(PATHPOINTS)
    if pathpoints.blank?
      pathpoints = Hash[ Objects::Path::Point.all.to_a.map{ |x| [ x.id.to_s, [x.lat,x.lng] ] } ]
      Rails.cache.write(PATHPOINTS, pathpoints)
    end
    return pathpoints
  end

  def photos
    photos = Rails.cache.read(PHOTOS)
    if photos.blank?
      photos = Hash[ Objects::Photo.all.to_a.map{ |x| [ x.id.to_s, [ x.thumbnail_url, x.large_url ] ] } ]
      Rails.cache.write(PHOTOS, photos)
    end
    return photos
  end

  def map_objects
    json = Rails.cache.read(MAPOBJECTS)
    if json.blank?
      objects = Objects::Office.all + Objects::Tower.all + Objects::Substation.all + Objects::Line.all + Objects::Path::Line.all
      pathpoints = Sys::Cache.pathpoints
      photos = Sys::Cache.photos
      regions = Hash[ Region.all.to_a.map{ |x| [ x.id.to_s, x ] } ]
      details = Hash[ Objects::Path::Detail.all.to_a.map{ |x| [ x.id.to_s, x ] } ]
      json = Objects::GeoJson.geo_json(objects, { regions: regions, details: details, pathpoints: pathpoints })
      Rails.cache.write(MAPOBJECTS, json)
    end
    return json
  end

  def clear_map_objects
    Rails.cache.delete(PATHPOINTS)
    Rails.cache.delete(MAPOBJECTS)
  end

  def add_object(object)
    json = map_objects
    json[:features].push(object.geo_json)
    Rails.cache.write(MAPOBJECTS, json)
  end

  def remove_object(object)
    json = map_objects
    features = json[:features]
    id = object.respond_to?(:id) ? object.id.to_s : object.to_s
    filtered = features.select{|x| x[:id] == id }
    features.delete(filtered.first) if filtered.any?
    Rails.cache.write(MAPOBJECTS, json)
  end

  def replace_object(object)
    remove_object(object)
    add_object(object)
  end

  module_function :pathpoints
  module_function :map_objects
  module_function :clear_map_objects
  module_function :add_object
  module_function :remove_object
  module_function :replace_object
end
