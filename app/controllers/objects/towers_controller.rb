# -*- encoding : utf-8 -*-
require 'zip'

class Objects::TowersController < ApplicationController
  def index
    @title='ანძები'
    @towers=Objects::Tower.asc(:kmlid).paginate(per_page:10, page: params[:page])
  end

  def upload
    @title='მონაცემების ატვირთვა'
    if request.post?
      Zip::File.open params[:data].tempfile do |zip_file|
        zip_file.each do |entry|
          if 'kml'==entry.name[-3..-1]
            kml=entry.get_input_stream.read
            Objects::Tower.from_kml(kml)
          end
        end
      end
      redirect_to objects_towers_url, notice: 'მონაცემები ატვირთულია'
    end
  end

  def show
    @title='ანძის თვისებები'
    @tower=Objects::Tower.find(params[:id])
  end

  protected
  def nav
    @nav=super
    @nav['ანძები']=objects_towers_url
    @nav[@title]=nil unless ['index'].include?(action_name)
  end
end
