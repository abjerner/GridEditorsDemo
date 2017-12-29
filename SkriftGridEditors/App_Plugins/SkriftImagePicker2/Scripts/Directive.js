angular.module('umbraco').directive('skriftImagepicker', function (entityResource, mediaHelper) {
    return {
        scope: {
            value: '=',
            config: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: '/App_Plugins/SkriftImagePicker2/Views/Directive.html',
        link: function (scope) {
            
            function initConfig() {

                console.log(scope.config);
                
                var cfg = scope.config;

                if (!cfg) cfg = {};

                if (!cfg.title) cfg.title = {};
                if (!cfg.title.mode) cfg.title.mode = 'optional';
                if (!cfg.title.placeholder) cfg.title.placeholder = '';

                if (!cfg.description) cfg.description = {};
                if (!cfg.description.mode) cfg.description.mode = 'optional';
                if (!cfg.description.placeholder) cfg.description.placeholder = '';
                if (!cfg.description.rows) cfg.description.rows = 3;

                cfg.title.required = cfg.title.mode == 'required';
                cfg.description.required = cfg.description.mode == 'required';

                scope.cfg = cfg;

            }

            function initValue() {

                if (!scope.value) scope.value = {};

                if (!scope.value.imageId) return;

                // Use the entityResource to look up data about the media (as we only store the ID in our value)
                entityResource.getById(scope.value.imageId, 'media').then(function (data) {
                    setImage(data);
                });

            }

            function setImage(image) {

                // Make sure we have an object as value
                if (!scope.value) scope.value = {};

                // Reset the image properties if no image id specified
                if (!image) {
                    scope.value.imageId = 0;
                    scope.image = null;
                    scope.imageUrl = null;
                    return;
                }

                // Set the image ID in the value
                scope.value.imageId = image.id;

                // Update the UI
                scope.image = image;
                scope.imageUrl = (image.image ? image.image : mediaHelper.resolveFileFromEntity(image)) + '?width=' + 500 + '&mode=crop';

            }
            
            scope.selectImage = function () {
                scope.mediaPickerOverlay = {
                    view: 'mediapicker',
                    title: 'Select image',
                    multiPicker: false,
                    onlyImages: true,
                    disableFolderSelect: true,
                    show: true,
                    submit: function (model) {

                        // Get the first image (there really only should be one)
                        var data = model.selectedImages[0];

                        setImage(data);

                        scope.mediaPickerOverlay.show = false;
                        scope.mediaPickerOverlay = null;

                    }
                };
            };

            scope.removeImage = function () {
                setImage(null);
            };

            initConfig();
            initValue();

        }
    };
});