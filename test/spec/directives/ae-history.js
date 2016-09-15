'use strict';

describe('Directive: aeHistory', function () {

  // load the directive's module
  beforeEach(module('alertasEnchentesApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ae-history></ae-history>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the aeHistory directive');
  }));
});
