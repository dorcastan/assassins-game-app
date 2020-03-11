class SessionsController < ApplicationController
    # NOTE: probably not working properly. But not critical.

    # Creates a new session by checking that username and password match
    def create 
        @user = User.find_by(username: session_params[:username])

        if @user && @user.authenticate(session_params[:password])
            login!
            render json: {
                logged_in: true,
                user: @user
            }
        else
            render json: {
                # TODO: don't use HTTP error codes for non-HTTP responses (confusing)
                status: 401,
                errors: ['Incorrect username or password']
            }
        end
    end

    # Checks whether there is a logged in user
    def is_logged_in?
        if logged_in? && current_user
            render json: {
                logged_in: true,
                user: current_user
            }
        else 
            render json: {
                logged_in: false,
                message: 'No such user'
            }
        end
    end

    # Ends a session by logging out
    def destroy
        logout!
        render json: {
            status: 200,
            logged_out: true
        }
    end

    private

    def session_params
        params.require(:user).permit(:username, :password)
    end
    
end
