module.exports = function notesRoutesPlugin() {
  return {
    name: 'notes-routes-plugin',
    async contentLoaded({ actions }) {
      const { addRoute } = actions;
      addRoute({
        path: '/notes',
        component: '@site/src/components/NotesIndex',
        exact: true,
      });
      addRoute({
        path: '/notes/:subject/:slug',
        component: '@site/src/components/NoteViewer',
        exact: true,
      });
    },
  };
};
