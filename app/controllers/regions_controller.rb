# -*- encoding : utf-8 -*-
class RegionsController < ApplicationController
  def index
    @title='რეგიონები'
  end

  protected
  def nav
    @nav=super
    @nav['რეგიონები']=regions_url
  end
end
