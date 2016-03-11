/*globals $,app:true*/

function HomeViewModel() {
    var self = this;

    self.init = function () {
        var $informationContainers = $('#home-information > div');

        setInterval(function () {
            $informationContainers
                // (Un)comment to see livereload in action!
                .animateCss('bounce')
                //.animateCss('pulse')
            ;
        }, 2000);
    };
}

app.HomeViewModel = HomeViewModel;