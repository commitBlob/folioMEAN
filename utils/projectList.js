
exports.buildProjectList = (projectsList) => {
  let projects = [];

  projectsList.forEach((val) => {
    let projectObj = {
      id: val.projectId,
      name: val.name
    };
    projects.push(projectObj)
  });

  return {
    length: projectsList.length,
    payload: projects
  };
};
