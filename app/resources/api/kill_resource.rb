class Api::KillResource < JSONAPI::Resource
  attributes :killer, :victim, :day

  def killer
    @model.killer.slice(:id, :name).values
  end

  def victim
    @model.victim.slice(:id, :name).values
  end

  filter :day
end
