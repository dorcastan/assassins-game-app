class Api::PlayerResource < JSONAPI::Resource
  attributes :name, :level, :status, :points, :killers, :victims

  def victims
    @model.victims.pluck(:id, :name).to_a
  end

  def killers
    @model.killers.pluck(:id, :name).to_a
  end
end
