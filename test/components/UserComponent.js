module.exports = {
  template: `
    <div>
      ID: <span id="id">{{ id }}</span>
      First name: <span id="firstName">{{ user.firstName }}</span>
      Adult: <span id="isAdult">{{ user.isAdult ? 'yes' : 'no' }}</span>
      Roles: <span id="roles">{{ user.roles.join(', ') }}</span>
    </div>
  `,

  props: ['user'],

  computed: {
    id() {
      return `${this.user.firstName.toLowerCase()}-${this.user.lastName.toLowerCase()}-${this.user.isAdult}`;
    }
  }
};
