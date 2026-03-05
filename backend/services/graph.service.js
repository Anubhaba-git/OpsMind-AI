async function buildGraphData() {
  return {
    topDocuments: [
      { name: "SOP_Security.pdf", count: 120 },
      { name: "HR_Policy.pdf", count: 98 }
    ],
    topTopics: [
      { topic: "Access Control", count: 76 },
      { topic: "Leave Policy", count: 54 }
    ]
  };
}

module.exports = { buildGraphData };
