var snare = {};

snare.setup = function(options) {

    snare.rope = {
        'enabled': false,
        'dev': false,
        'origin': {'x': 0, 'y': 0},
        'id': 'snare-rope',
        'prey': 'snare-prey',
        'css': {
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'border': '2px solid #666'
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

                var dims = that.dims($('#'+that.id));
                var preyDims = that.dims(this);

                if(that.dev) {
                    $('#snare-dev').html('<div>selection: '+JSON.stringify(dims)+'</div>');
                }

                var trapped = false;

                var points = [
                    ['x', 'y', 'y','width'], ['x', 'height', 'x', 'y'],
                    ['width', 'y', 'x', y], ['width', 'height', 'x', 'y']
                ];

                for(var idx in points) {
                    if( that.inside(
                            preyDims[points[idx][0]],
                            preyDims[points[idx][1]],
                            dims[points[idx][2]],
                            dims[points[idx][3]],
                            dims.width, dims.height) ) {
                        trapped = true;
                        break;
                    }
                }

                if(trapped)
                    $(this).addClass('snare-trapped');
                else
                    $(this).removeClass('snare-trapped');
            });
        },
        'inside': function(x, y, left, top, right, bottom) {
            if(x > left && x < right && y > top && y < bottom)
                return true;
            else
                return false;
        },
        'dims': function(el) {
            var pos = $(el).offset();

            return {
                'x': parseInt(pos.left, 10),
                'y': parseInt(pos.top, 10),
                'width': $(el).outerWidth(),
                'height': $(el).outerHeight()
            };
        },
        'burn': function() {
            $('#'+this.id).remove();
        }
    };

    options = options || {};
    $.extend(snare.rope, options);

    if(options.dev) {
        $('<div id="snare-dev" />').appendTo('body').css({'position': 'absolute', 'bottom': '10px'});
    }

    $(document).mouseup(function(e) {
        snare.rope.enabled = false;
        snare.rope.burn();
    });

    $(document).mousemove(function(e) {
        snare.rope.update(e.which === 1, e.pageX, e.pageY);
    });

};
