# -*- encoding : utf-8 -*-
require 'zip'

class Objects::SubstationsController < ApplicationController
  def index
    respond_to do |format|
      format.html{ @title='ქვესადგურები'; @substations=Objects::Substation.asc(:kmlid).paginate(per_page:10, page: params[:page]) }
      format.xlsx{ @substations=Objects::Substation.asc(:kmlid) }
    end
  end

  def upload
    @title='ფაილის ატვირთვა'
    if request.post?
      f=params[:data].original_filename
      case File.extname(f).downcase
      when '.kmz' then upload_kmz(params[:data].tempfile)
      when '.kml' then upload_kml(params[:data].tempfile)
      when '.xlsx' then upload_xlsx(params[:data].tempfile)
      else raise 'არასწორი ფორმატი' end
      redirect_to objects_substations_url, notice: 'მონაცემები ატვირთულია'
    end
  end

  def show
    @title='ქვესადგურის თვისებები'
    @substation=Objects::Substation.find(params[:id])
  end

  protected
  def nav
    @nav=super
    @nav['ქვესადგურები']=objects_substations_url
    @nav[@title]=nil unless ['index'].include?(action_name)
  end

  private

  def upload_kmz(file)
    Zip::File.open file do |zip_file|
      zip_file.each do |entry|
        upload_kml(entry) if 'kml'==entry.name[-3..-1]
      end
    end
  end

  def upload_kml(file)
    kml=file.get_input_stream.read
    Objects::Substation.from_kml(kml)
  end

  def upload_xlsx(file)
    sheet=Roo::Spreadsheet.open(file.path, extension: 'xlsx')
    (2..sheet.last_row).each do |row|
      id=sheet.cell('A',row) ; name=sheet.excelx_value('C',row).to_s ; regionname=sheet.cell('D',row).to_s
      lat=sheet.cell('E',row).to_f; lng=sheet.cell('F',row).to_f
      region=Region.where(name:regionname).first
      region=Region.create(name:regionname) unless region.present?
      substation=Objects::Substation.find(id)
      substation.name=name ; substation.region=region
      substation.lat=lat ; substation.lng=lng
      substation.save
    end
  end
end
