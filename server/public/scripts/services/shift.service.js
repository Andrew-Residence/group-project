myApp.service('ShiftService', function ($http, $location, $mdDialog) {
  console.log('ShiftService Loaded');
  var self = this;
  self.shift = {};
  self.filledByName = { data: [] }
  self.newShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    notify: [],
    shift_status: '',
    floor: '',
    filled: null
  };

  self.updatedShift = {
    shiftDate: [],
    urgent: false,
    shift: '',
    adl: false,
    mhw: false,
    nurse: false,
    comments: '',
    // notify: 
    shift_status: ''
  };

  self.filledShift = {
    filledBy: '',
    shift_status: 'Filled'
  };

  self.shiftsToDisplay = { data: [] };
  self.filledByName = { data: [] }
  //calls the addShift popup
  // self.addShift = function (event) {
  //   console.log('add new shift button clicked');
  //   $mdDialog.show({
  //     controller: 'AddShiftController as sd',
  //     templateUrl: '/views/templates/addShift.html',
  //     parent: angular.element(document.body),
  //     targetEvent: event,
  //     clickOutsideToClose: true,
  //     fullscreen: self.customFullscreen // Only for -xs, -sm breakpoints.
  //   })
  // }; //end addShift popup function
  //calls 
  self.shiftDetails = function (event, shift) {
    // console.log('shift details button clicked', shift);
    self.shift = shift;
    return $http.get('/shifts/filled/who/' + shift.shift_id).then(function (response) {
      self.filledByName.data = response.data
      return response
    })
  }

  // self.getShifts = function (firstOfMonth, lastOfMonth) {
  //   console.log('get shifts is running');
  //   console.log('first and last of month - service', firstOfMonth, lastOfMonth)
  //   return $http.get('/shifts').then(function (response) {
  //     console.log('response', response.data)
  //     self.shiftsToDisplay.data = response.data;
  //     return response;
  //   });
  // };


  //addNewShift function and route
  self.addNewShift = function (staffId, selection, shiftDate, shiftStatus, urgent, shift, role, comments, notify, nurse, adl, mhw, floor) {
    console.log('filled by', staffId);
    console.log('the Selection', selection);
    console.log('shiftDate', shiftDate);
    staffId = self.newShift.filled;
    self.newShift.notify = selection;
    self.newShift.shiftDate = shiftDate;
    urgent = self.newShift.urgent;
    shift = self.newShift.shift;
    role = self.newShift.role;
    comments = self.newShift.comments;
    nurse = self.newShift.nurse;
    adl = self.newShift.adl;
    mhw = self.newShift.mhw;
    shiftStatus = self.newShift.shift_status;
    floor = self.newShift.floor;
    console.log('newshift', self.newShift);
    if (urgent) {
      $http.post('/message/urgent', self.newShift).then(function (response) {

        console.log(response);

      }).catch(function (response) {
        console.log('send urgent textMessage did not work:', response);
      });
    }
    // if (self.newShift.shift_status === 'Filled') {
    //   console.log('here')
    //   $http.post('/shifts/confirmation', self.newShift).then(function (response) {

    //     console.log(response);

    //   }).catch(function (response) {
    //     console.log('confirmed filled did not work:', response);
    //   });
    // }
    return $http.post('/shifts/', self.newShift).then(function (response) {
      console.log('the response', response)
      self.newShift = {}
      return response;
      //     if (self.newShift.shift_status === 'Filled') {
      // console.log('here')
      // $http.post('/shifts/confirmation', self.newShift).then(function (response) {

      //   console.log(response);

      // }).catch(function (response) {
      //   console.log('confirmed filled did not work:', response);
      // });
    // }
    }).catch(function (err) {
      console.log('Error');
    });
  }; //end addNewShift function and route

  // self.getShifts = function (firstOfMonth, lastOfMonth) {
  //   console.log('get shifts is running');
  //   console.log('first of month', firstOfMonth);
  //   console.log('last Of Month', lastOfMonth);
  //   self.shiftsToDisplay.data = [];
  //   // console.log('shifts to display service', self.shiftsToDisplay.data)
  //   return $http.get('/shifts').then(function (response) {
  //     // console.log('response', response.data)
  //     self.shiftsToDisplay.data = response.data;
  //     // console.log('shifts to display in service, after query', self.shiftsToDisplay.data)
  //     return response;
  //   });
  // };

  self.getShifts = function (firstDayofShifts, lastDayofShifts) {
    console.log('get shifts is running');
    console.log('first of month', firstDayofShifts);
    console.log('last Of Month', lastDayofShifts);
    var firstAndLastDays = {
      firstDayofShifts: firstDayofShifts, 
      lastDayofShifts: lastDayofShifts
    }
    self.shiftsToDisplay.data = [];
    // console.log('shifts to display service', self.shiftsToDisplay.data)
    return $http.put('/shifts', firstAndLastDays).then(function (response) {
      console.log('response', response.data)
      self.shiftsToDisplay.data = response.data;
      console.log('shifts to display in service, after query', self.shiftsToDisplay.data)
      return response;
    });
  };

  
  self.pendingShifts = {
    data: []
  };

  self.getPendingShifts = function () {
    var today = moment().format('YYYY-MM-DD');
    // console.log('today', today);
    // return 
    $http.get('/shifts/shiftbid/' + today).then(function (response) {
      // console.log('response', response.data);
      self.pendingShifts.data = response.data;
      console.log('pending shifts', self.pendingShifts.data)
      for (var i = 0; i < self.pendingShifts.data.length; i++) {
        self.pendingShifts.data[i].date = moment(self.pendingShifts.data[i].date).format('M/D');
      }
      console.log('after first loop')
      for (var i = 0; i < self.pendingShifts.data.length; i++) {
        console.log('getting here after the second loop')
        
        for (var j = i + 1; j < self.pendingShifts.data.length; j++) {
          console.log('now I am here after the 3rd')
          if (self.pendingShifts.data[i].shift_id == self.pendingShifts.data[j].shift_id) {
            self.pendingShifts.data.splice(j, 1);
          }
          console.log('after the loops', self.pendingShifts.data)
        }
      }
    }
        )   // return response;
  };

  self.getShiftsToConfirm = function (shiftId) {
    console.log('shift id in service', shiftId);
    return $http.get('/shifts/shiftbidToConfirm/' + shiftId).then(function (response) {
      // console.log('response', response.data);
      return response;
    });
  };

  self.confirmShift = function(staffMember, allShifts) {
    console.log('staff member to confirm', staffMember.name);
    return $http.post('/shifts/confirm', staffMember, allShifts).then(function (response) {
      console.log('confirmed shift', staffMember.name, response);
      return response;
    });
  };

  self.pickUpShift = function (shift) {
    return $http.post('/shifts/shiftBid', shift).then(function (response) {
      // console.log('posted shift bid', shift, response);
      return response;
    });
  };

  
  self.getMyShifts = function (firstDayofShifts, lastDayofShifts) {
    var firstAndLastDays = {
        firstDayofShifts: firstDayofShifts, 
        lastDayofShifts: lastDayofShifts
    }
    // console.log('get my shifts clicked')
    return $http.put('/shifts/getmyshifts', firstAndLastDays).then(function (response) {
      // console.log('response from server', response.data)
      return response.data;
    });
  };


  /* for Message testing; see popUpTest Controller and message.html */
  self.sendTextMessage = function () {
    //what is required for Plivo to deliver message;
    textParams = {
      src: '',
      dst: '',
      text: '',

    };
    $http.post('/message/text').then(function (response) {

      console.log(response);

    }).catch(function (response) {
      console.log('send textMessage did not work:', response);
    });
  };//end of sendTextMessage

  self.sendEmailMessage = function () {
    $http.post('/message/email').then(function (response) {
      // neccessary params for email transport object;
      emailParams = {
        to: '', // list of receivers
        subject: '', // Subject line
        text: '', // plain text body;
        html: '', // html body
      };
      console.log(response);

    }).catch(function (response) {
      console.log('send emailMessage did not work: ', response);
    });
  };

  //start updateShift function
  self.updateShift = function (id, comments, shift, mhw, adl, nurse, date, floor) {
    console.log('UPDATED SHIFT', id, comments, shift, mhw, adl, nurse, date, floor);
    self.updatedShift.shift_id = id;
    self.updatedShift.comments = comments;
    self.updatedShift.shift = shift;
    self.updatedShift.mhw = mhw;
    self.updatedShift.adl = adl;
    self.updatedShift.nurse = nurse;
    self.updatedShift.date = date;
    self.updatedShift.floor = floor;
    return $http.put('/shifts/update/' + id, self.updatedShift).then(function (response) {
      return response;
    }).catch(function (response) {
      console.log('Error updating shift');
    });
  };
  //end updateShift function

  //start deleteShift function
  self.deleteShift = function (shiftId) {
    return $http.delete('/shifts/delete' + shiftId).then(function (response) {
      return response;
    }).catch(function (response) {
      console.log('Error deleting shift');

    });
  };
  //end deleteShift function

  //start shiftFilled function
  self.shiftFilled = function (id, shiftId) {

    self.filledShift.filledBy = id;

    return $http.put('/shifts/filledBy/' + shiftId, self.filledShift)
      .then(function (response) {
        return response;
      }).catch(function (response) {
        console.log('Error filling shift');

      });
  };
  //end shiftFilled function

});