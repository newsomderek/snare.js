var snare = {};

snare.setup = function() {

    snare.rope = {
        'enabled': false,
        'origin': {'x': 0, 'y': 0},
        'id': 'snare-rope',
        'prey': 'snare-prey',
        'css': {
                'position': 'absolute',
                'top': '0px',
                'left': '0px',
                'border': '2px solid #666',
        },
        'update': function(mouseDown, x, y) {
            if(mouseDown) {
               if(this.enabled) {
                   if(x < this.origin.x) {
                       $('#'+this.id).css('left', x).css('width', this.origin.x - x);
                   } else {
                       $('#'+this.id).css('width', x - this.origin.x);
                   }

                   if(y < this.origin.y) {
                       $('#'+this.id).css('top', y).css('height', this.origin.y - y);
                   } else {
                       $('#'+this.id).css('height', y - this.origin.y);
                   }

               } else {
                   this.enabled = true;

                   this.origin.x = x;
                   this.origin.y = y;

                   this.css.top = y + 'px';
                   this.css.left = x + 'px';

                   $('<div id="'+this.id+'" />').appendTo('body').css(this.css);
               }

               this.check(x, y);
            }
        },
        'check': function(x, y) {
            var that = this;

            $('.'+this.prey).each(function() {

                var dims = that.dimensions($('#'+that.id));
                var preyDims = that.dimensions(this);

            });
        },
        'dimensions': function(el) {
            var pos = $(el).position();

            var height = parseInt($(el).height());
            var paddedHeight = height + parseInt($(el).css('padding-top')) +
                parseInt($(el).css('padding-bottom'));

            var width = parseInt($(el).width());
            var paddedWidth = width + parseInt($(el).css('padding-left')) +
                parseInt($(el).css('padding-right'));

            return {
                'x': parseInt(pos.left),
                'y': parseInt(pos.top),
                'width': width > paddedWidth ? width : paddedWidth,
                'height': height > paddedHeight ? height : paddedHeight
            };
        },
        'burn': function() {
            $('#'+this.id).remove();
        }
    };

    $(document).mouseup(function(e) {
        snare.rope.enabled = false;
        snare.rope.burn();
    });

    $(document).mousemove(function(e) {
           snare.rope.update(e.which === 1, e.pageX, e.pageY);
    });

};
