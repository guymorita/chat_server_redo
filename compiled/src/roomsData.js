// Generated by CoffeeScript 1.6.3
(function() {
  exports.messages = {};

  exports.messages.results = [
    {
      username: 'poopflsgd',
      text: 'fooby',
      room: 'not null'
    }
  ];

  exports.post = function(data, room) {
    if (!data.roomname) {
      exports.room = [];
    }
    return exports.room.push(data);
  };

}).call(this);

/*
//@ sourceMappingURL=roomsData.map
*/
