angular.module("umbraco").controller("Skrift.ImagePickerGridEditor.Controller", function ($scope, mediaHelper, entityResource) {

    function initConfig() {

        // Make a "shortcut" for the grid editor configuration
        var cfg = $scope.control.editor.config;

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

        $scope.cfg = cfg;

    }

    function initValue() {

        if (!$scope.control.value.imageId) return;

        // Use the entityResource to look up data about the media (as we only store the ID in our control value)
        entityResource.getById($scope.control.value.imageId, 'media').then(function (data) {
            setImage(data);
        });

    }

    function setImage(image) {

        // Make sure we have an object as value
        if (!$scope.control.value) $scope.control.value = {};

        // Reset the image properties if no image id specified
        if (!image) {
            $scope.control.value.imageId = 0;
            $scope.image = null;
            $scope.imageUrl = null;
            return;
        }

        // Set the image ID in the control value
        $scope.control.value.imageId = image.id;

        // Update the UI
        $scope.image = image;
        $scope.imageUrl = (image.image ? image.image : mediaHelper.resolveFileFromEntity(image)) + '?width=' + 500 + '&mode=crop';

    }
    
    $scope.selectImage = function () {
        $scope.mediaPickerOverlay = {
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

                $scope.mediaPickerOverlay.show = false;
                $scope.mediaPickerOverlay = null;

            }
        };
    };

    $scope.removeImage = function() {
        setImage(null);
    };

    initConfig();

    initValue();

});