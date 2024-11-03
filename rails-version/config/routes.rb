Rails.application.routes.draw do
  resources :pokemons do
    get 'results', on: :collection
  end
  root 'home#index'
  post 'vote', to: 'home#vote'

  
  # Keep any existing routes below this line
end
