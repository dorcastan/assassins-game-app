Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  root to: "home#index"

  namespace :api do
    jsonapi_resources :players
    jsonapi_resources :kills
  end

  post '/login', to: 'sessions#create'
  delete '/logout', to: 'sessions#destroy'
  get '/logged_in', to: 'sessions#is_logged_in?'

  # game controller methods
  get '/current_day', to: 'game#current_day'
  get '/kill', to: 'game#kill'
  get '/level_up', to: 'game#level_up'
  get '/revive', to: 'game#revive'
  get '/next_day', to: 'game#next_day'
  get '/undo_kill', to: 'game#undo_kill'
  get '/undo_revive', to: 'game#undo_revive'
  get '/undo_level_up', to: 'game#undo_level_up'
  get '/undo_next_day', to: 'game#undo_next_day'

  get "*path", to: "home#index", constraints: { format: "html" }
end
