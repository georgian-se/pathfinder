# -*- encoding : utf-8 -*-
require 'zip'

class Objects::SubstationsController < ApplicationController
  def index
    @search = search_params
    rel = Objects::Substation
    if @search.present?
      rel = rel.where(name: @search[:name].mongonize) if @search[:name].present?
      rel = rel.where(region_id: @search[:region]) if @search[:region].present?
      rel = rel.where(kmlid: @search[:kmlid].mongonize) if @search[:kmlid].present?
    end
    respond_to do |format|
      format.html { @title='ქვესადგურები' ; @substations = rel.asc(:kmlid).paginate(per_page:10, page: params[:page]) }
      format.xlsx{ @substations = rel.asc(:kmlid) }
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
      id = sheet.cell('A',row)
      # B = KMLID
      name = sheet.excelx_value('C',row).to_s
      regionname = sheet.cell('D',row).to_s
      lat = sheet.cell('E',row).to_f
      lng = sheet.cell('F',row).to_f
      description = sheet.cell('G', row).to_s
      region=Region.where(name:regionname).first
      region=Region.create(name:regionname) unless region.present?
      substation=Objects::Substation.find(id)
      substation.name=name ; substation.region=region
      substation.lat=lat ; substation.lng=lng
      substation.description = description
      substation.save
    end
  end
end
