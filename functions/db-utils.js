const getMatch = async (matchID) => {
  console.log('utils matchID: ', matchID);
  try {
    const matches = [];
    const matchesQuery = await db.where('matchID', '==', matchID).get();
    
    matchesQuery.forEach((docMatch) => {
      matches.push(docMatch.data());
    });

    return matches[0];
  } catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = {
  getMatch: getMatch
};