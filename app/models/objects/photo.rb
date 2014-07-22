# -*- encoding : utf-8 -*-
class Objects::Photo
  include Mongoid::Document
  include Mongoid::Timestamps
  belongs_to :owner, polymorphic: true
  field :filename, type: String
  field :confirmed, type: Mongoid::Boolean
end
