<template>
  <div>
    <h4 class="text-center text-white p-2" v-bind:class="themeClass">
      {{ editMode ? "Edit" : "Create Permission" }}
    </h4>
    <h4
      v-if="$v.$invalid && $v.$dirty"
      class="bg-danger text-white text-center p-2"
    >
      Values are required for all Fields
    </h4>
    <div class="form-group" v-if="editMode">
      <label>ID (Not Editable)</label>
      <input class="form-control" disabled v-model="permission.permissionId" />
    </div>
    <div class="form-group">
      <label>Name</label>
      <input class="form-control" v-model="$v.permission.name.$model" />
      <validation-error v-bind:validation="$v.permission.name" />
    </div>
    <div class="form-group">
      <label>Last Name</label>
      <input class="form-control" v-model="$v.permission.lastName.$model" />
      <validation-error v-bind:validation="$v.permission.lastName" />
    </div>
    <div class="form-group">
      <label>Permission Type</label>
      <select
        v-model="$v.permission.permissionType.$model"
        class="form-control"
      >
        <option
          v-for="pt in permissionTypes"
          v-bind:value="pt.permissionTypeId"
          v-bind:key="pt.permissionTypeId"
        >
          {{ pt.description }}
        </option>
      </select>
      <validation-error v-bind:validation="$v.permission.permissionType" />
    </div>
    <div class="text-center">
      <router-link to="/permissionList" class="btn btn-secondary m-1"
        >Cancel
      </router-link>
      <button
        class="btn m-1"
        v-bind:class="themeClassButton"
        v-on:click="handleSave"
      >
        {{ editMode ? "Save Changes" : "Save Permisison" }}
      </button>
    </div>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import ValidationError from "./ValidationError";

export default {
  components: { ValidationError },
  data: function () {
    return {
      permission: {
        name: "",
        lastName: "",
        permissionType: 7,
      },
      permissionTypes: [],
    };
  },
  computed: {
    editMode() {
      return this.$route.params["op"] == "edit";
    },
    themeClass() {
      return this.editMode ? "bg-info" : "bg-primary";
    },
    themeClassButton() {
      return this.editMode ? "btn-info" : "btn-primary";
    },
  },
  validations: {
    permission: {
      name: { required },
      lastName: { required },
      permissionType: { required },
    },
  },
  methods: {
    async handleSave() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.editMode) {
          await this.updatePermission(this.permission);
        } else {
          await this.addPermission(this.permission);
        }

        this.$router.push("/");
      }
    },
    async addPermission(permission) {
      this.restDataSource.save(permission);
    },

    async updatePermission(permission) {
      await this.restDataSource.update(permission);
    },

    processPermissions(newpermission) {
      Object.assign(this.permission, newpermission);
    },

    processPermissionsTypes(newpermissionType) {
      this.permissionTypes.splice(0);
      this.permissionTypes.push(...newpermissionType);
    },

    async getPermissionById() {
      let id = this.$route.params["id"];
      this.processPermissions(await this.restDataSource.getById(id));
    },
  },
  inject: ["eventBus", "restDataSource"],
  async created() {
    this.processPermissionsTypes(
      await this.restDataSource.getPermissionTypes()
    );
  },
  async mounted() {
    let id = this.$route.params["id"];
    if (id) {
      this.getPermissionById();
    }
  },
};
</script>