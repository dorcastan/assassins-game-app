namespace :start do
    task :development do
        exec 'heroku local -f Procfile.dev'
        # exec 'foreman start -f Procfile.dev'
    end
end

desc 'Start development server'
task :start => 'start:development'
