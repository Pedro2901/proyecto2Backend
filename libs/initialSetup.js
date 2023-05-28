import Role from "../usuario/RoleModel";
export const createRoles = async () => {
  try {
    // Count Documents
    const count = await Role.estimatedDocumentCount();

    // check for existing roles
    if (count > 0) return;

    // Create default Roles
    const values = await Promise.all([
      new Role({ name: "user" }).save(),

    ]);

    console.log(values);
  } catch (error) {
    console.error(error);
  }
};