class Api::KillResource < JSONAPI::Resource
  attributes :killer, :victim, :day

  def killer
    # NOTE: will cause problems if the database has invalid entries
    @model.killer.slice(:id, :name).values if @model.killer 
  end

  def victim
    @model.victim.slice(:id, :name).values if @model.victim
  end

  filter :day
end
