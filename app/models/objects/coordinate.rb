# -*- encoding : utf-8 -*-
module Objects::Coordinate
  def self.included(base)
    base.field :location, type: Array
    base.field :alt, type: Float
    base.index({ location: "2dsphere" }, { min: -200, max: 200 })
  end

  def set_coordinate(text)
    coords=text.split(',').map{|x| x.strip.to_f}
    self.lng=coords[0].to_f
    self.lat=coords[1].to_f
    self.alt=coords[2].to_f
  end

  def lng; self.location ? self.location[0] : 0 end
  def lng=(x)
    self.location=[0,0] if self.location.blank?
    self.location[0]=x.to_f
  end

  def lat; self.location ? self.location[1] : 0 end
  def lat=(x)
    self.location=[0,0] if self.location.blank?
    self.location[1]=x.to_f
  end

  def position_latitude; self.lat end
  def position_longitude; self.lng end
end
