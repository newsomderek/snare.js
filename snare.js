var snare = {};

snare.setup = function(options) {

    snare.rope = {
        'enabled': false,
        'dev': false,
        'origin': {'x': 0, 'y': 0},
        'id': 'snare-rope',
        'prey': 'snare-prey',
        'trappedClass': 'snare-trapped',
        'css': {
            'position': 'absolute',
            'top': '0px',
            'left': '0px',
            'border': '2px solid #666'
        },
        'shiftKeyPressed': false,
        'escKeyPressed': false,
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
                var collided = that.collision($('#'+that.id), $(this));

                if(that.shiftKeyPressed) {
                    if(collided && !$(this).hasClass('snare-shift') && $(this).hasClass(that.trappedClass)) {
                        $(this).removeClass(that.trappedClass);
                        $(this).addClass('snare-shift');
                    } else if(collided && !$(this).hasClass('snare-shift')) {
                        $(this).addClass(that.trappedClass);
                        $(this).addClass('snare-shift');
                    }

                    if(!collided && $(this).hasClass('snare-shift')) {
                        $(this).removeClass('snare-shift');

                        if($(this).hasClass(that.trappedClass)) {
                            $(this).removeClass(that.trappedClass);
                        } else {
                            $(this).addClass(that.trappedClass);
                        }
                    }
                } else {
                    if(collided) {
                        $(this).addClass(that.trappedClass);
                    } else {
                        $(this).removeClass(that.trappedClass);
                    }
                }
            });
        },
        'collision': function(div1, div2) {
            var x1 = div1.offset().left;
            var y1 = div1.offset().top;
            var h1 = div1.outerHeight();
            var w1 = div1.outerWidth();
            var b1 = y1 + h1;
            var r1 = x1 + w1;
            var x2 = div2.offset().left;
            var y2 = div2.offset().top;
            var h2 = div2.outerHeight();
            var w2 = div2.outerWidth();
            var b2 = y2 + h2;
            var r2 = x2 + w2;

            if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
            return true;
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

    $(document).keydown(function(e) {
        // activate shift key
        if(e.which === 16 || e.which === 17 || e.which === 91 || e.which == 93) {
            snare.rope.shiftKeyPressed = true
        } else if(e.which === 27 && !snare.rope.escKeyPressed) { // escape key
            snare.rope.escKeyPressed = true;
            $('.snare-trapped').each(function() {
                $(this).removeClass(snare.rope.trappedClass);
            });
        }
    }).keyup(function(e) {
        // de-activate shift key
        if((e.which === 16 || e.which === 17 || e.which === 91 || e.which == 93) && !snare.rope.enabled) {
            snare.rope.shiftKeyPressed = false;
        } else if(e.which === 27) { // escape key
            snare.rope.escKeyPressed = false;
        }
    });

    $(document).mouseup(function(e) {
        snare.rope.enabled = false;
        snare.rope.burn();

        if(snare.rope.shiftKeyPressed) {
            // undo any shift keyed items
            $('.snare-shift').each(function() {
                $(this).removeClass('snare-shift');
            });
        } else {
            snare.rope.shiftKeyPressed = false;
        }
    });

    $(document).mousemove(function(e) {
        snare.rope.update(e.which === 1, e.pageX, e.pageY);
    });

};
