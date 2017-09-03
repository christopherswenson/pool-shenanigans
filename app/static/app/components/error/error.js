
const ERROR_MAP = {
  "no_password_match": "Passwords do not match",
  "no_first_name": "First name must not be blank",
  "no_last_name": "Last name must not be blank",
  "no_username": "Username must not be blank",
  "user_exists": "Username exists",
  "password_too_short": `Password must be 8+ characters`,
  "no_invitation_code": "An invitation code is required",
  "no_guest_code": "Please enter a guest code",
  "invalid_invitation": "Invalid invitation code",
  "invalid_login_credentials": "Invalid login credentials",
  "no_guest_first_name": "Guest's first name must not be blank",
  "no_guest_last_name": "Guest's last name must not be blank",

  // Account.Tables pane
  "no_matching_table_member": "You're not a member of that table",
  "no_join_table_name": "Enter the name of the table you'd like to join",
  "no_create_table_name": "Enter the name of the table you'd like to create",
  "no_matching_table": "No table with that name exists",
  "table_member_exists": "You are already a member of that table",
  "table_exists": "A table with that name already exists",

  // Account.Guests pane
  "not_your_guest": "You can't remove guests you didn't add",
  "player_is_not_guest": "That player is not a guest",
  "no_matching_guest": "Could not find that player",

  // Account.Friends pane
  "friendship_exists": "You are already friends",
  "no_friend_username": "Enter the username of the friend to add",
  "self_friending": "You can only be your own friend in real life",
  "no_matching_username": "No friend with that username exists",

  // Account.Account pane
  "bad_password": "Incorrect password",
}

class ErrorPane {
  constructor ($element, params) {
    this.$element = $element
    this.error = null
  }

  // Property getters and setters

  set error (value) {
    this._error = value
    if (value == null) {
      this.$element.html("")
    } else {
      Template.load(this.$element, "error.html", {
        "#error": ERROR_MAP[value] || "An unknown error occurred"
      })
    }
  }

  get error () {
    return this._error
  }
}
