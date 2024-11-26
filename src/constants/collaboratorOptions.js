import { getCollaboratorsBySysAdmin } from '../api/collaborator';

export let collaboratorCodeOptions = [];

export const getAllCollaboratorOptions = async (page) => {
  try {
    const limit = 20;
    const respone = await getCollaboratorsBySysAdmin({ page, limit });
    collaboratorCodeOptions = respone.data.collaborators.map((collaborator) => ({
      collaboratorCode: collaborator.collaboratorCode,
      name: collaborator.collaboratorCode + '_' + collaborator.name + '  ',
      roleName: collaborator.role?.roleName,
      roleCode: collaborator.role?.roleCode,
    }));
    return collaboratorCodeOptions;
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }
};
