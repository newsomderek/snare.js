var snare = {};

snare.setup = function(options) {

    snare.rope = {
        'enabled': true,
        'enable': function() {
            this.enabled = true;
        },
        'disable': function() {
            this.enabled = false;
            var that = this;
            $('.'+this.trappedClass).each(function() {
                $(this).removeClass(that.trappedClass);
            });
        },
        'inProgress': false,
        'origin': {'x': 0, 'y': 0},
        'parent': document,
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
        'mouseStartOnPrey': false,
        'update': function(mouseDown, x, y) {
            if(mouseDown && !this.mouseStartOnPrey) {
               if(this.inProgress) {
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
                   this.inProgress = true;

                   this.origin.x = x;
                   this.origin.y = y;

                   this.css.top = y + 'px';
                   this.css.left = x + 'px';

                   $('<div id="'+this.id+'" />').appendTo('body').css(this.css);

                   this.check(x, y, true)
               }

               this.check(x, y);
            }
        },
        'check': function(x, y, firstCheck) {
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
        },
        'getTrapped': function() {
            var trapped = [];

            $('.'+this.trappedClass).each(function() {
                trapped.push($(this));
            });

            return trapped;
        }
    };

    options = options || {};
    $.extend(snare.rope, options);

    $('.'+snare.rope.prey).mousedown(function(e) {
        snare.rope.mouseStartOnPrey = true;
        snare.rope.inProgress = true;
    }).mouseup(function(e) {
        if(snare.rope.shiftKeyPressed && $(e.target).hasClass(snare.rope.trappedClass) && snare.rope.enabled) {
            $(e.target).removeClass(snare.rope.trappedClass);
        } else if(snare.rope.shiftKeyPressed && snare.rope.enabled) {
            $(e.target).addClass(snare.rope.trappedClass);
        }
    });

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
        if((e.which === 16 || e.which === 17 || e.which === 91 || e.which == 93) && !snare.rope.inProgress) {
            snare.rope.shiftKeyPressed = false;
        } else if(e.which === 27) { // escape key
            snare.rope.escKeyPressed = false;
        }
    });

    $(document).mouseup(function(e) {

        // clear out selections if mouse clicked and wasn't selecting trying to select
        if(!snare.rope.inProgress && !snare.rope.shiftKeyPressed) {
            $('.'+snare.rope.trappedClass).each(function() {
                $(this).removeClass(snare.rope.trappedClass);
            });
        }

        snare.rope.inProgress = false;
        snare.rope.mouseStartOnPrey = false;
        snare.rope.burn();

        if(snare.rope.shiftKeyPressed) {
            // undo any shift keyed items
            $('.snare-shift').each(function() {
                $(this).removeClass('snare-shift');
            });
        } else {
            snare.rope.shiftKeyPressed = false;
        }

        // enable text selection
        var cssUserSelect = {
            '-moz-user-select': 'text',
            '-khtml-user-select': 'auto',
            '-webkit-user-select': 'auto',
            '-ms-user-select': 'auto',
            'user-select': 'auto'
        };

        $(snare.rope.parent === document ? 'body' : snare.rope.parent).css(cssUserSelect);
    });

    $(snare.rope.parent).mousemove(function(e) {
        if(snare.rope.enabled) {
            snare.rope.update(e.which === 1, e.pageX, e.pageY);

            // disable text selection
            var cssUserSelect = {
                '-moz-user-select': '-moz-none',
                '-khtml-user-select': 'none',
                '-webkit-user-select': 'none',
                '-ms-user-select': 'none',
                'user-select': 'none'
            };

            $(snare.rope.parent === document ? 'body' : snare.rope.parent).css(cssUserSelect);
        }
    });

};
