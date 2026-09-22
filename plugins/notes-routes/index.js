module.exports = function notesRoutesPlugin() {
  return {
    name: 'notes-routes-plugin',
    async contentLoaded({ actions }) {
      const { addRoute } = actions;
      addRoute({
        path: '/notes',
        component: '@site/src/components/NotesRouter',
        exact: false,
      });
    },
  };
};
