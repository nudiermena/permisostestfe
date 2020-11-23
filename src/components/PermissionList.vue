<template>
  <div>
    <table class="table table-sm table-bordered">
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Last Name</th>
        <th>Permission Type</th>
        <th>Permission Date</th>
        <th></th>
      </tr>
      <tbody>
        <tr v-for="p in permissions" v-bind:key="p.permissionId">
          <td>{{ p.permissionId }}</td>
          <td>{{ p.name }}</td>
          <td>{{ p.lastName }}</td>
          <td>{{ p.permissionType.description }}</td>
          <td>{{ p.permissionDate }}</td>
          <td>
            <button class="btn btn-sm btn-primary" v-on:click="handleEdit(p)">
              Edit
            </button>
            <button class="btn btn-sm btn-danger" v-on:click="handleDelete(p)">
              Delete
            </button>
          </td>
        </tr>
        <tr v-if="permissions.length == 0">
          <td colspan="5" class="text-center">No Data</td>
        </tr>
      </tbody>
    </table>
    <div class="text-center">
      <router-link to="/permission/create" class="btn btn-primary my-2">
        Create New
      </router-link>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<script>
export default {
  name: "PermissionList",
  data() {
    return {
      permissions: [],
    };
  },
  methods: {
    handleEdit(permission) {
      this.$router.push(`/permission/edit/${permission.permissionId}`);
    },
    handleDelete(permission) {
      this.deletePermission(permission);
    },
    createNew() {
      this.$router.push("/permission");
    },

    editPermission(permission) {
      this.eventBus.$emit("edit", permission);
    },

    async deletePermission(permission) {
      await this.restDataSource.delete(permission);
      let index = this.permissions.findIndex(
        (p) => p.id == permission.permissionId
      );
      this.permissions.splice(index, 1);
      alert("permission deleted");
      this.$forceUpdate();
    },

    processPermissions(newpermission) {
      this.permissions.splice(0);
      this.permissions.push(...newpermission);
    },

    async processComplete(permission) {
      let index = this.permissions.findIndex((p) => p.id == permission.id);
      if (index == -1) {
        await this.restDataSource.saveProduct(permission);
        this.permissions.push(permission);
      } else {
        await this.restDataSource.updateProduct(permission);
        Vue.set(this.permission, index, permission);
      }
    },
  },
  inject: ["eventBus", "restDataSource"],
  async mounted() {
    let data = this.restDataSource.get();
    console.log(data);
    this.processPermissions(await this.restDataSource.get());
  },
  async created() {},
};
</script>