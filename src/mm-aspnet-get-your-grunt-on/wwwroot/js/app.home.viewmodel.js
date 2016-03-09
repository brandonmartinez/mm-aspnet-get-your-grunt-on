/*globals $,app:true*/

function HomeViewModel() {
    var self = this;

    self.init = function () {
        var $informationContainers = $('#home-information > div');

        setInterval(function () {
            $informationContainers.animateCss('bounce');
        }, 2000);
    };
}

app.HomeViewModel = HomeViewModel;