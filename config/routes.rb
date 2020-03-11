Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "home#index"

  namespace :api do
    jsonapi_resources :players
  end

  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'

  # game controller methods
  get '/kill', to: 'game#kill'
  get '/level_up', to: 'game#level_up'
  get '/revive', to: 'game#revive'
  get '/undo_kill', to: 'game#undo_kill'
  get '/undo_revive', to: 'game#undo_revive'
  get '/undo_level_up', to: 'game#undo_level_up'

  get "*path", to: "home#index", constraints: { format: "html" }
end
