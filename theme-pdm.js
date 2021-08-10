!(function (a, b, c, d) {
    function e(b, c) {
        (this.settings = null),
            (this.options = a.extend({}, e.Defaults, c)),
            (this.$element = a(b)),
            (this._handlers = {}),
            (this._plugins = {}),
            (this._supress = {}),
            (this._current = null),
            (this._speed = null),
            (this._coordinates = []),
            (this._breakpoint = null),
            (this._width = null),
            (this._items = []),
            (this._clones = []),
            (this._mergers = []),
            (this._widths = []),
            (this._invalidated = {}),
            (this._pipe = []),
            (this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null }),
            (this._states = { current: {}, tags: { initializing: ["busy"], animating: ["busy"], dragging: ["interacting"] } }),
            a.each(
                ["onResize", "onThrottledResize"],
                a.proxy(function (b, c) {
                    this._handlers[c] = a.proxy(this[c], this);
                }, this)
            ),
            a.each(
                e.Plugins,
                a.proxy(function (a, b) {
                    this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this);
                }, this)
            ),
            a.each(
                e.Workers,
                a.proxy(function (b, c) {
                    this._pipe.push({ filter: c.filter, run: a.proxy(c.run, this) });
                }, this)
            ),
            this.setup(),
            this.initialize();
    }
    (e.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: b,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab",
    }),
        (e.Width = { Default: "default", Inner: "inner", Outer: "outer" }),
        (e.Type = { Event: "event", State: "state" }),
        (e.Plugins = {}),
        (e.Workers = [
            {
                filter: ["width", "settings"],
                run: function () {
                    this._width = this.$element.width();
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (a) {
                    a.current = this._items && this._items[this.relative(this._current)];
                },
            },
            {
                filter: ["items", "settings"],
                run: function () {
                    this.$stage.children(".cloned").remove();
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (a) {
                    var b = this.settings.margin || "",
                        c = !this.settings.autoWidth,
                        d = this.settings.rtl,
                        e = { width: "auto", "margin-left": d ? b : "", "margin-right": d ? "" : b };
                    !c && this.$stage.children().css(e), (a.css = e);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (a) {
                    var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                        c = null,
                        d = this._items.length,
                        e = !this.settings.autoWidth,
                        f = [];
                    for (a.items = { merge: !1, width: b }; d--; )
                        (c = this._mergers[d]), (c = (this.settings.mergeFit && Math.min(c, this.settings.items)) || c), (a.items.merge = c > 1 || a.items.merge), (f[d] = e ? b * c : this._items[d].width());
                    this._widths = f;
                },
            },
            {
                filter: ["items", "settings"],
                run: function () {
                    var b = [],
                        c = this._items,
                        d = this.settings,
                        e = Math.max(2 * d.items, 4),
                        f = 2 * Math.ceil(c.length / 2),
                        g = d.loop && c.length ? (d.rewind ? e : Math.max(e, f)) : 0,
                        h = "",
                        i = "";
                    for (g /= 2; g > 0; ) b.push(this.normalize(b.length / 2, !0)), (h += c[b[b.length - 1]][0].outerHTML), b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), (i = c[b[b.length - 1]][0].outerHTML + i), (g -= 1);
                    (this._clones = b), a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function () {
                    for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b; )
                        (d = f[c - 1] || 0), (e = this._widths[this.relative(c)] + this.settings.margin), f.push(d + e * a);
                    this._coordinates = f;
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function () {
                    var a = this.settings.stagePadding,
                        b = this._coordinates,
                        c = { width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a, "padding-left": a || "", "padding-right": a || "" };
                    this.$stage.css(c);
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (a) {
                    var b = this._coordinates.length,
                        c = !this.settings.autoWidth,
                        d = this.$stage.children();
                    if (c && a.items.merge) for (; b--; ) (a.css.width = this._widths[this.relative(b)]), d.eq(b).css(a.css);
                    else c && ((a.css.width = a.items.width), d.css(a.css));
                },
            },
            {
                filter: ["items"],
                run: function () {
                    this._coordinates.length < 1 && this.$stage.removeAttr("style");
                },
            },
            {
                filter: ["width", "items", "settings"],
                run: function (a) {
                    (a.current = a.current ? this.$stage.children().index(a.current) : 0), (a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current))), this.reset(a.current);
                },
            },
            {
                filter: ["position"],
                run: function () {
                    this.animate(this.coordinates(this._current));
                },
            },
            {
                filter: ["width", "position", "items", "settings"],
                run: function () {
                    var a,
                        b,
                        c,
                        d,
                        e = this.settings.rtl ? 1 : -1,
                        f = 2 * this.settings.stagePadding,
                        g = this.coordinates(this.current()) + f,
                        h = g + this.width() * e,
                        i = [];
                    for (c = 0, d = this._coordinates.length; c < d; c++)
                        (a = this._coordinates[c - 1] || 0), (b = Math.abs(this._coordinates[c]) + f * e), ((this.op(a, "<=", g) && this.op(a, ">", h)) || (this.op(b, "<", g) && this.op(b, ">", h))) && i.push(c);
                    this.$stage.children(".active").removeClass("active"),
                        this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"),
                        this.$stage.children(".center").removeClass("center"),
                        this.settings.center && this.$stage.children().eq(this.current()).addClass("center");
                },
            },
        ]),
        (e.prototype.initializeStage = function () {
            (this.$stage = this.$element.find("." + this.settings.stageClass)),
                this.$stage.length ||
                    (this.$element.addClass(this.options.loadingClass),
                    (this.$stage = a("<" + this.settings.stageElement + ">", { class: this.settings.stageClass }).wrap(a("<div/>", { class: this.settings.stageOuterClass }))),
                    this.$element.append(this.$stage.parent()));
        }),
        (e.prototype.initializeItems = function () {
            var b = this.$element.find(".owl-item");
            if (b.length)
                return (
                    (this._items = b.get().map(function (b) {
                        return a(b);
                    })),
                    (this._mergers = this._items.map(function () {
                        return 1;
                    })),
                    void this.refresh()
                );
            this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
        }),
        (e.prototype.initialize = function () {
            if ((this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading"))) {
                var a, b, c;
                (a = this.$element.find("img")), (b = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d), (c = this.$element.children(b).width()), a.length && c <= 0 && this.preloadAutoWidthImages(a);
            }
            this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized");
        }),
        (e.prototype.isVisible = function () {
            return !this.settings.checkVisibility || this.$element.is(":visible");
        }),
        (e.prototype.setup = function () {
            var b = this.viewport(),
                c = this.options.responsive,
                d = -1,
                e = null;
            c
                ? (a.each(c, function (a) {
                      a <= b && a > d && (d = Number(a));
                  }),
                  (e = a.extend({}, this.options, c[d])),
                  "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()),
                  delete e.responsive,
                  e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d)))
                : (e = a.extend({}, this.options)),
                this.trigger("change", { property: { name: "settings", value: e } }),
                (this._breakpoint = d),
                (this.settings = e),
                this.invalidate("settings"),
                this.trigger("changed", { property: { name: "settings", value: this.settings } });
        }),
        (e.prototype.optionsLogic = function () {
            this.settings.autoWidth && ((this.settings.stagePadding = !1), (this.settings.merge = !1));
        }),
        (e.prototype.prepare = function (b) {
            var c = this.trigger("prepare", { content: b });
            return (
                c.data ||
                    (c.data = a("<" + this.settings.itemElement + "/>")
                        .addClass(this.options.itemClass)
                        .append(b)),
                this.trigger("prepared", { content: c.data }),
                c.data
            );
        }),
        (e.prototype.update = function () {
            for (
                var b = 0,
                    c = this._pipe.length,
                    d = a.proxy(function (a) {
                        return this[a];
                    }, this._invalidated),
                    e = {};
                b < c;

            )
                (this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
            (this._invalidated = {}), !this.is("valid") && this.enter("valid");
        }),
        (e.prototype.width = function (a) {
            switch ((a = a || e.Width.Default)) {
                case e.Width.Inner:
                case e.Width.Outer:
                    return this._width;
                default:
                    return this._width - 2 * this.settings.stagePadding + this.settings.margin;
            }
        }),
        (e.prototype.refresh = function () {
            this.enter("refreshing"),
                this.trigger("refresh"),
                this.setup(),
                this.optionsLogic(),
                this.$element.addClass(this.options.refreshClass),
                this.update(),
                this.$element.removeClass(this.options.refreshClass),
                this.leave("refreshing"),
                this.trigger("refreshed");
        }),
        (e.prototype.onThrottledResize = function () {
            b.clearTimeout(this.resizeTimer), (this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate));
        }),
        (e.prototype.onResize = function () {
            return (
                !!this._items.length &&
                this._width !== this.$element.width() &&
                !!this.isVisible() &&
                (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
            );
        }),
        (e.prototype.registerEventHandlers = function () {
            a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)),
                !1 !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize),
                this.settings.mouseDrag &&
                    (this.$element.addClass(this.options.dragClass),
                    this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)),
                    this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
                        return !1;
                    })),
                this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)));
        }),
        (e.prototype.onDragStart = function (b) {
            var d = null;
            3 !== b.which &&
                (a.support.transform
                    ? ((d = this.$stage
                          .css("transform")
                          .replace(/.*\(|\)| /g, "")
                          .split(",")),
                      (d = { x: d[16 === d.length ? 12 : 4], y: d[16 === d.length ? 13 : 5] }))
                    : ((d = this.$stage.position()), (d = { x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left, y: d.top })),
                this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")),
                this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type),
                this.speed(0),
                (this._drag.time = new Date().getTime()),
                (this._drag.target = a(b.target)),
                (this._drag.stage.start = d),
                (this._drag.stage.current = d),
                (this._drag.pointer = this.pointer(b)),
                a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)),
                a(c).one(
                    "mousemove.owl.core touchmove.owl.core",
                    a.proxy(function (b) {
                        var d = this.difference(this._drag.pointer, this.pointer(b));
                        a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), (Math.abs(d.x) < Math.abs(d.y) && this.is("valid")) || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"));
                    }, this)
                ));
        }),
        (e.prototype.onDragMove = function (a) {
            var b = null,
                c = null,
                d = null,
                e = this.difference(this._drag.pointer, this.pointer(a)),
                f = this.difference(this._drag.stage.start, e);
            this.is("dragging") &&
                (a.preventDefault(),
                this.settings.loop
                    ? ((b = this.coordinates(this.minimum())), (c = this.coordinates(this.maximum() + 1) - b), (f.x = ((((f.x - b) % c) + c) % c) + b))
                    : ((b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum())),
                      (c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum())),
                      (d = this.settings.pullDrag ? (-1 * e.x) / 5 : 0),
                      (f.x = Math.max(Math.min(f.x, b + d), c + d))),
                (this._drag.stage.current = f),
                this.animate(f.x));
        }),
        (e.prototype.onDragEnd = function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b)),
                e = this._drag.stage.current,
                f = (d.x > 0) ^ this.settings.rtl ? "left" : "right";
            a(c).off(".owl.core"),
                this.$element.removeClass(this.options.grabClass),
                ((0 !== d.x && this.is("dragging")) || !this.is("valid")) &&
                    (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed),
                    this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)),
                    this.invalidate("position"),
                    this.update(),
                    (this._drag.direction = f),
                    (Math.abs(d.x) > 3 || new Date().getTime() - this._drag.time > 300) &&
                        this._drag.target.one("click.owl.core", function () {
                            return !1;
                        })),
                this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
        }),
        (e.prototype.closest = function (b, c) {
            var e = -1,
                f = 30,
                g = this.width(),
                h = this.coordinates();
            return (
                this.settings.freeDrag ||
                    a.each(
                        h,
                        a.proxy(function (a, i) {
                            return (
                                "left" === c && b > i - f && b < i + f
                                    ? (e = a)
                                    : "right" === c && b > i - g - f && b < i - g + f
                                    ? (e = a + 1)
                                    : this.op(b, "<", i) && this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) && (e = "left" === c ? a + 1 : a),
                                -1 === e
                            );
                        }, this)
                    ),
                this.settings.loop || (this.op(b, ">", h[this.minimum()]) ? (e = b = this.minimum()) : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())),
                e
            );
        }),
        (e.prototype.animate = function (b) {
            var c = this.speed() > 0;
            this.is("animating") && this.onTransitionEnd(),
                c && (this.enter("animating"), this.trigger("translate")),
                a.support.transform3d && a.support.transition
                    ? this.$stage.css({ transform: "translate3d(" + b + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "") })
                    : c
                    ? this.$stage.animate({ left: b + "px" }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this))
                    : this.$stage.css({ left: b + "px" });
        }),
        (e.prototype.is = function (a) {
            return this._states.current[a] && this._states.current[a] > 0;
        }),
        (e.prototype.current = function (a) {
            if (a === d) return this._current;
            if (0 === this._items.length) return d;
            if (((a = this.normalize(a)), this._current !== a)) {
                var b = this.trigger("change", { property: { name: "position", value: a } });
                b.data !== d && (a = this.normalize(b.data)), (this._current = a), this.invalidate("position"), this.trigger("changed", { property: { name: "position", value: this._current } });
            }
            return this._current;
        }),
        (e.prototype.invalidate = function (b) {
            return (
                "string" === a.type(b) && ((this._invalidated[b] = !0), this.is("valid") && this.leave("valid")),
                a.map(this._invalidated, function (a, b) {
                    return b;
                })
            );
        }),
        (e.prototype.reset = function (a) {
            (a = this.normalize(a)) !== d && ((this._speed = 0), (this._current = a), this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]));
        }),
        (e.prototype.normalize = function (a, b) {
            var c = this._items.length,
                e = b ? 0 : this._clones.length;
            return !this.isNumeric(a) || c < 1 ? (a = d) : (a < 0 || a >= c + e) && (a = ((((a - e / 2) % c) + c) % c) + e / 2), a;
        }),
        (e.prototype.relative = function (a) {
            return (a -= this._clones.length / 2), this.normalize(a, !0);
        }),
        (e.prototype.maximum = function (a) {
            var b,
                c,
                d,
                e = this.settings,
                f = this._coordinates.length;
            if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
            else if (e.autoWidth || e.merge) {
                if ((b = this._items.length)) for (c = this._items[--b].width(), d = this.$element.width(); b-- && !((c += this._items[b].width() + this.settings.margin) > d); );
                f = b + 1;
            } else f = e.center ? this._items.length - 1 : this._items.length - e.items;
            return a && (f -= this._clones.length / 2), Math.max(f, 0);
        }),
        (e.prototype.minimum = function (a) {
            return a ? 0 : this._clones.length / 2;
        }),
        (e.prototype.items = function (a) {
            return a === d ? this._items.slice() : ((a = this.normalize(a, !0)), this._items[a]);
        }),
        (e.prototype.mergers = function (a) {
            return a === d ? this._mergers.slice() : ((a = this.normalize(a, !0)), this._mergers[a]);
        }),
        (e.prototype.clones = function (b) {
            var c = this._clones.length / 2,
                e = c + this._items.length,
                f = function (a) {
                    return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2;
                };
            return b === d
                ? a.map(this._clones, function (a, b) {
                      return f(b);
                  })
                : a.map(this._clones, function (a, c) {
                      return a === b ? f(c) : null;
                  });
        }),
        (e.prototype.speed = function (a) {
            return a !== d && (this._speed = a), this._speed;
        }),
        (e.prototype.coordinates = function (b) {
            var c,
                e = 1,
                f = b - 1;
            return b === d
                ? a.map(
                      this._coordinates,
                      a.proxy(function (a, b) {
                          return this.coordinates(b);
                      }, this)
                  )
                : (this.settings.center ? (this.settings.rtl && ((e = -1), (f = b + 1)), (c = this._coordinates[b]), (c += ((this.width() - c + (this._coordinates[f] || 0)) / 2) * e)) : (c = this._coordinates[f] || 0), (c = Math.ceil(c)));
        }),
        (e.prototype.duration = function (a, b, c) {
            return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed);
        }),
        (e.prototype.to = function (a, b) {
            var c = this.current(),
                d = null,
                e = a - this.relative(c),
                f = (e > 0) - (e < 0),
                g = this._items.length,
                h = this.minimum(),
                i = this.maximum();
            this.settings.loop
                ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), (a = c + e), (d = ((((a - h) % g) + g) % g) + h) !== a && d - e <= i && d - e > 0 && ((c = d - e), (a = d), this.reset(c)))
                : this.settings.rewind
                ? ((i += 1), (a = ((a % i) + i) % i))
                : (a = Math.max(h, Math.min(i, a))),
                this.speed(this.duration(c, a, b)),
                this.current(a),
                this.isVisible() && this.update();
        }),
        (e.prototype.next = function (a) {
            (a = a || !1), this.to(this.relative(this.current()) + 1, a);
        }),
        (e.prototype.prev = function (a) {
            (a = a || !1), this.to(this.relative(this.current()) - 1, a);
        }),
        (e.prototype.onTransitionEnd = function (a) {
            if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
            this.leave("animating"), this.trigger("translated");
        }),
        (e.prototype.viewport = function () {
            var d;
            return (
                this.options.responsiveBaseElement !== b
                    ? (d = a(this.options.responsiveBaseElement).width())
                    : b.innerWidth
                    ? (d = b.innerWidth)
                    : c.documentElement && c.documentElement.clientWidth
                    ? (d = c.documentElement.clientWidth)
                    : console.warn("Can not detect viewport width."),
                d
            );
        }),
        (e.prototype.replace = function (b) {
            this.$stage.empty(),
                (this._items = []),
                b && (b = b instanceof jQuery ? b : a(b)),
                this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)),
                b
                    .filter(function () {
                        return 1 === this.nodeType;
                    })
                    .each(
                        a.proxy(function (a, b) {
                            (b = this.prepare(b)), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
                        }, this)
                    ),
                this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0),
                this.invalidate("items");
        }),
        (e.prototype.add = function (b, c) {
            var e = this.relative(this._current);
            (c = c === d ? this._items.length : this.normalize(c, !0)),
                (b = b instanceof jQuery ? b : a(b)),
                this.trigger("add", { content: b, position: c }),
                (b = this.prepare(b)),
                0 === this._items.length || c === this._items.length
                    ? (0 === this._items.length && this.$stage.append(b),
                      0 !== this._items.length && this._items[c - 1].after(b),
                      this._items.push(b),
                      this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1))
                    : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)),
                this._items[e] && this.reset(this._items[e].index()),
                this.invalidate("items"),
                this.trigger("added", { content: b, position: c });
        }),
        (e.prototype.remove = function (a) {
            (a = this.normalize(a, !0)) !== d &&
                (this.trigger("remove", { content: this._items[a], position: a }),
                this._items[a].remove(),
                this._items.splice(a, 1),
                this._mergers.splice(a, 1),
                this.invalidate("items"),
                this.trigger("removed", { content: null, position: a }));
        }),
        (e.prototype.preloadAutoWidthImages = function (b) {
            b.each(
                a.proxy(function (b, c) {
                    this.enter("pre-loading"),
                        (c = a(c)),
                        a(new Image())
                            .one(
                                "load",
                                a.proxy(function (a) {
                                    c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh();
                                }, this)
                            )
                            .attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"));
                }, this)
            );
        }),
        (e.prototype.destroy = function () {
            this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), !1 !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
            for (var d in this._plugins) this._plugins[d].destroy();
            this.$stage.children(".cloned").remove(),
                this.$stage.unwrap(),
                this.$stage.children().contents().unwrap(),
                this.$stage.children().unwrap(),
                this.$stage.remove(),
                this.$element
                    .removeClass(this.options.refreshClass)
                    .removeClass(this.options.loadingClass)
                    .removeClass(this.options.loadedClass)
                    .removeClass(this.options.rtlClass)
                    .removeClass(this.options.dragClass)
                    .removeClass(this.options.grabClass)
                    .attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), ""))
                    .removeData("owl.carousel");
        }),
        (e.prototype.op = function (a, b, c) {
            var d = this.settings.rtl;
            switch (b) {
                case "<":
                    return d ? a > c : a < c;
                case ">":
                    return d ? a < c : a > c;
                case ">=":
                    return d ? a <= c : a >= c;
                case "<=":
                    return d ? a >= c : a <= c;
            }
        }),
        (e.prototype.on = function (a, b, c, d) {
            a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c);
        }),
        (e.prototype.off = function (a, b, c, d) {
            a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c);
        }),
        (e.prototype.trigger = function (b, c, d, f, g) {
            var h = { item: { count: this._items.length, index: this.current() } },
                i = a.camelCase(
                    a
                        .grep(["on", b, d], function (a) {
                            return a;
                        })
                        .join("-")
                        .toLowerCase()
                ),
                j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({ relatedTarget: this }, h, c));
            return (
                this._supress[b] ||
                    (a.each(this._plugins, function (a, b) {
                        b.onTrigger && b.onTrigger(j);
                    }),
                    this.register({ type: e.Type.Event, name: b }),
                    this.$element.trigger(j),
                    this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)),
                j
            );
        }),
        (e.prototype.enter = function (b) {
            a.each(
                [b].concat(this._states.tags[b] || []),
                a.proxy(function (a, b) {
                    this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++;
                }, this)
            );
        }),
        (e.prototype.leave = function (b) {
            a.each(
                [b].concat(this._states.tags[b] || []),
                a.proxy(function (a, b) {
                    this._states.current[b]--;
                }, this)
            );
        }),
        (e.prototype.register = function (b) {
            if (b.type === e.Type.Event) {
                if ((a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl)) {
                    var c = a.event.special[b.name]._default;
                    (a.event.special[b.name]._default = function (a) {
                        return !c || !c.apply || (a.namespace && -1 !== a.namespace.indexOf("owl")) ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments);
                    }),
                        (a.event.special[b.name].owl = !0);
                }
            } else
                b.type === e.Type.State &&
                    (this._states.tags[b.name] ? (this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags)) : (this._states.tags[b.name] = b.tags),
                    (this._states.tags[b.name] = a.grep(
                        this._states.tags[b.name],
                        a.proxy(function (c, d) {
                            return a.inArray(c, this._states.tags[b.name]) === d;
                        }, this)
                    )));
        }),
        (e.prototype.suppress = function (b) {
            a.each(
                b,
                a.proxy(function (a, b) {
                    this._supress[b] = !0;
                }, this)
            );
        }),
        (e.prototype.release = function (b) {
            a.each(
                b,
                a.proxy(function (a, b) {
                    delete this._supress[b];
                }, this)
            );
        }),
        (e.prototype.pointer = function (a) {
            var c = { x: null, y: null };
            return (
                (a = a.originalEvent || a || b.event),
                (a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a),
                a.pageX ? ((c.x = a.pageX), (c.y = a.pageY)) : ((c.x = a.clientX), (c.y = a.clientY)),
                c
            );
        }),
        (e.prototype.isNumeric = function (a) {
            return !isNaN(parseFloat(a));
        }),
        (e.prototype.difference = function (a, b) {
            return { x: a.x - b.x, y: a.y - b.y };
        }),
        (a.fn.owlCarousel = function (b) {
            var c = Array.prototype.slice.call(arguments, 1);
            return this.each(function () {
                var d = a(this),
                    f = d.data("owl.carousel");
                f ||
                    ((f = new e(this, "object" == typeof b && b)),
                    d.data("owl.carousel", f),
                    a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (b, c) {
                        f.register({ type: e.Type.Event, name: c }),
                            f.$element.on(
                                c + ".owl.carousel.core",
                                a.proxy(function (a) {
                                    a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]));
                                }, f)
                            );
                    })),
                    "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c);
            });
        }),
        (a.fn.owlCarousel.Constructor = e);
})(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (b) {
            (this._core = b),
                (this._interval = null),
                (this._visible = null),
                (this._handlers = {
                    "initialized.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.autoRefresh && this.watch();
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (e.Defaults = { autoRefresh: !0, autoRefreshInterval: 500 }),
            (e.prototype.watch = function () {
                this._interval || ((this._visible = this._core.isVisible()), (this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval)));
            }),
            (e.prototype.refresh = function () {
                this._core.isVisible() !== this._visible && ((this._visible = !this._visible), this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh());
            }),
            (e.prototype.destroy = function () {
                var a, c;
                b.clearInterval(this._interval);
                for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
                for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (b) {
            (this._core = b),
                (this._loaded = []),
                (this._handlers = {
                    "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) {
                        if (b.namespace && this._core.settings && this._core.settings.lazyLoad && ((b.property && "position" == b.property.name) || "initialized" == b.type)) {
                            var c = this._core.settings,
                                e = (c.center && Math.ceil(c.items / 2)) || c.items,
                                f = (c.center && -1 * e) || 0,
                                g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f,
                                h = this._core.clones().length,
                                i = a.proxy(function (a, b) {
                                    this.load(b);
                                }, this);
                            for (c.lazyLoadEager > 0 && ((e += c.lazyLoadEager), c.loop && ((g -= c.lazyLoadEager), e++)); f++ < e; ) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++;
                        }
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this._core.$element.on(this._handlers);
        };
        (e.Defaults = { lazyLoad: !1, lazyLoadEager: 0 }),
            (e.prototype.load = function (c) {
                var d = this._core.$stage.children().eq(c),
                    e = d && d.find(".owl-lazy");
                !e ||
                    a.inArray(d.get(0), this._loaded) > -1 ||
                    (e.each(
                        a.proxy(function (c, d) {
                            var e,
                                f = a(d),
                                g = (b.devicePixelRatio > 1 && f.attr("data-src-retina")) || f.attr("data-src") || f.attr("data-srcset");
                            this._core.trigger("load", { element: f, url: g }, "lazy"),
                                f.is("img")
                                    ? f
                                          .one(
                                              "load.owl.lazy",
                                              a.proxy(function () {
                                                  f.css("opacity", 1), this._core.trigger("loaded", { element: f, url: g }, "lazy");
                                              }, this)
                                          )
                                          .attr("src", g)
                                    : f.is("source")
                                    ? f
                                          .one(
                                              "load.owl.lazy",
                                              a.proxy(function () {
                                                  this._core.trigger("loaded", { element: f, url: g }, "lazy");
                                              }, this)
                                          )
                                          .attr("srcset", g)
                                    : ((e = new Image()),
                                      (e.onload = a.proxy(function () {
                                          f.css({ "background-image": 'url("' + g + '")', opacity: "1" }), this._core.trigger("loaded", { element: f, url: g }, "lazy");
                                      }, this)),
                                      (e.src = g));
                        }, this)
                    ),
                    this._loaded.push(d.get(0)));
            }),
            (e.prototype.destroy = function () {
                var a, b;
                for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
                for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.Lazy = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (c) {
            (this._core = c),
                (this._previousHeight = null),
                (this._handlers = {
                    "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.autoHeight && this.update();
                    }, this),
                    "changed.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.autoHeight && "position" === a.property.name && this.update();
                    }, this),
                    "loaded.owl.lazy": a.proxy(function (a) {
                        a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update();
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this._core.$element.on(this._handlers),
                (this._intervalId = null);
            var d = this;
            a(b).on("load", function () {
                d._core.settings.autoHeight && d.update();
            }),
                a(b).resize(function () {
                    d._core.settings.autoHeight &&
                        (null != d._intervalId && clearTimeout(d._intervalId),
                        (d._intervalId = setTimeout(function () {
                            d.update();
                        }, 250)));
                });
        };
        (e.Defaults = { autoHeight: !1, autoHeightClass: "owl-height" }),
            (e.prototype.update = function () {
                var b = this._core._current,
                    c = b + this._core.settings.items,
                    d = this._core.settings.lazyLoad,
                    e = this._core.$stage.children().toArray().slice(b, c),
                    f = [],
                    g = 0;
                a.each(e, function (b, c) {
                    f.push(a(c).height());
                }),
                    (g = Math.max.apply(null, f)),
                    g <= 1 && d && this._previousHeight && (g = this._previousHeight),
                    (this._previousHeight = g),
                    this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass);
            }),
            (e.prototype.destroy = function () {
                var a, b;
                for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
                for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (b) {
            (this._core = b),
                (this._videos = {}),
                (this._playing = null),
                (this._handlers = {
                    "initialized.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.register({ type: "state", name: "playing", tags: ["interacting"] });
                    }, this),
                    "resize.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault();
                    }, this),
                    "refreshed.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove();
                    }, this),
                    "changed.owl.carousel": a.proxy(function (a) {
                        a.namespace && "position" === a.property.name && this._playing && this.stop();
                    }, this),
                    "prepared.owl.carousel": a.proxy(function (b) {
                        if (b.namespace) {
                            var c = a(b.content).find(".owl-video");
                            c.length && (c.css("display", "none"), this.fetch(c, a(b.content)));
                        }
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this._core.$element.on(this._handlers),
                this._core.$element.on(
                    "click.owl.video",
                    ".owl-video-play-icon",
                    a.proxy(function (a) {
                        this.play(a);
                    }, this)
                );
        };
        (e.Defaults = { video: !1, videoHeight: !1, videoWidth: !1 }),
            (e.prototype.fetch = function (a, b) {
                var c = (function () {
                        return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube";
                    })(),
                    d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
                    e = a.attr("data-width") || this._core.settings.videoWidth,
                    f = a.attr("data-height") || this._core.settings.videoHeight,
                    g = a.attr("href");
                if (!g) throw new Error("Missing video URL.");
                if (
                    ((d = g.match(
                        /(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/
                    )),
                    d[3].indexOf("youtu") > -1)
                )
                    c = "youtube";
                else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
                else {
                    if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
                    c = "vzaar";
                }
                (d = d[6]), (this._videos[g] = { type: c, id: d, width: e, height: f }), b.attr("data-video", g), this.thumbnail(a, this._videos[g]);
            }),
            (e.prototype.thumbnail = function (b, c) {
                var d,
                    e,
                    f,
                    g = c.width && c.height ? "width:" + c.width + "px;height:" + c.height + "px;" : "",
                    h = b.find("img"),
                    i = "src",
                    j = "",
                    k = this._core.settings,
                    l = function (c) {
                        (e = '<div class="owl-video-play-icon"></div>'),
                            (d = k.lazyLoad ? a("<div/>", { class: "owl-video-tn " + j, srcType: c }) : a("<div/>", { class: "owl-video-tn", style: "opacity:1;background-image:url(" + c + ")" })),
                            b.after(d),
                            b.after(e);
                    };
                if ((b.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })), this._core.settings.lazyLoad && ((i = "data-src"), (j = "owl-lazy")), h.length)) return l(h.attr(i)), h.remove(), !1;
                "youtube" === c.type
                    ? ((f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg"), l(f))
                    : "vimeo" === c.type
                    ? a.ajax({
                          type: "GET",
                          url: "//vimeo.com/api/v2/video/" + c.id + ".json",
                          jsonp: "callback",
                          dataType: "jsonp",
                          success: function (a) {
                              (f = a[0].thumbnail_large), l(f);
                          },
                      })
                    : "vzaar" === c.type &&
                      a.ajax({
                          type: "GET",
                          url: "//vzaar.com/api/videos/" + c.id + ".json",
                          jsonp: "callback",
                          dataType: "jsonp",
                          success: function (a) {
                              (f = a.framegrab_url), l(f);
                          },
                      });
            }),
            (e.prototype.stop = function () {
                this._core.trigger("stop", null, "video"),
                    this._playing.find(".owl-video-frame").remove(),
                    this._playing.removeClass("owl-video-playing"),
                    (this._playing = null),
                    this._core.leave("playing"),
                    this._core.trigger("stopped", null, "video");
            }),
            (e.prototype.play = function (b) {
                var c,
                    d = a(b.target),
                    e = d.closest("." + this._core.settings.itemClass),
                    f = this._videos[e.attr("data-video")],
                    g = f.width || "100%",
                    h = f.height || this._core.$stage.height();
                this._playing ||
                    (this._core.enter("playing"),
                    this._core.trigger("play", null, "video"),
                    (e = this._core.items(this._core.relative(e.index()))),
                    this._core.reset(e.index()),
                    (c = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>')),
                    c.attr("height", h),
                    c.attr("width", g),
                    "youtube" === f.type
                        ? c.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id)
                        : "vimeo" === f.type
                        ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1")
                        : "vzaar" === f.type && c.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"),
                    a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")),
                    (this._playing = e.addClass("owl-video-playing")));
            }),
            (e.prototype.isInFullScreen = function () {
                var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
                return b && a(b).parent().hasClass("owl-video-frame");
            }),
            (e.prototype.destroy = function () {
                var a, b;
                this._core.$element.off("click.owl.video");
                for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
                for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.Video = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (b) {
            (this.core = b),
                (this.core.options = a.extend({}, e.Defaults, this.core.options)),
                (this.swapping = !0),
                (this.previous = d),
                (this.next = d),
                (this.handlers = {
                    "change.owl.carousel": a.proxy(function (a) {
                        a.namespace && "position" == a.property.name && ((this.previous = this.core.current()), (this.next = a.property.value));
                    }, this),
                    "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
                        a.namespace && (this.swapping = "translated" == a.type);
                    }, this),
                    "translate.owl.carousel": a.proxy(function (a) {
                        a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
                    }, this),
                }),
                this.core.$element.on(this.handlers);
        };
        (e.Defaults = { animateOut: !1, animateIn: !1 }),
            (e.prototype.swap = function () {
                if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
                    this.core.speed(0);
                    var b,
                        c = a.proxy(this.clear, this),
                        d = this.core.$stage.children().eq(this.previous),
                        e = this.core.$stage.children().eq(this.next),
                        f = this.core.settings.animateIn,
                        g = this.core.settings.animateOut;
                    this.core.current() !== this.previous &&
                        (g &&
                            ((b = this.core.coordinates(this.previous) - this.core.coordinates(this.next)),
                            d
                                .one(a.support.animation.end, c)
                                .css({ left: b + "px" })
                                .addClass("animated owl-animated-out")
                                .addClass(g)),
                        f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f));
                }
            }),
            (e.prototype.clear = function (b) {
                a(b.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd();
            }),
            (e.prototype.destroy = function () {
                var a, b;
                for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
                for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.Animate = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        var e = function (b) {
            (this._core = b),
                (this._call = null),
                (this._time = 0),
                (this._timeout = 0),
                (this._paused = !0),
                (this._handlers = {
                    "changed.owl.carousel": a.proxy(function (a) {
                        a.namespace && "settings" === a.property.name ? (this._core.settings.autoplay ? this.play() : this.stop()) : a.namespace && "position" === a.property.name && this._paused && (this._time = 0);
                    }, this),
                    "initialized.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.autoplay && this.play();
                    }, this),
                    "play.owl.autoplay": a.proxy(function (a, b, c) {
                        a.namespace && this.play(b, c);
                    }, this),
                    "stop.owl.autoplay": a.proxy(function (a) {
                        a.namespace && this.stop();
                    }, this),
                    "mouseover.owl.autoplay": a.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
                    }, this),
                    "mouseleave.owl.autoplay": a.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play();
                    }, this),
                    "touchstart.owl.core": a.proxy(function () {
                        this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
                    }, this),
                    "touchend.owl.core": a.proxy(function () {
                        this._core.settings.autoplayHoverPause && this.play();
                    }, this),
                }),
                this._core.$element.on(this._handlers),
                (this._core.options = a.extend({}, e.Defaults, this._core.options));
        };
        (e.Defaults = { autoplay: !1, autoplayTimeout: 5e3, autoplayHoverPause: !1, autoplaySpeed: !1 }),
            (e.prototype._next = function (d) {
                (this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read())),
                    this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed);
            }),
            (e.prototype.read = function () {
                return new Date().getTime() - this._time;
            }),
            (e.prototype.play = function (c, d) {
                var e;
                this._core.is("rotating") || this._core.enter("rotating"),
                    (c = c || this._core.settings.autoplayTimeout),
                    (e = Math.min(this._time % (this._timeout || c), c)),
                    this._paused ? ((this._time = this.read()), (this._paused = !1)) : b.clearTimeout(this._call),
                    (this._time += (this.read() % c) - e),
                    (this._timeout = c),
                    (this._call = b.setTimeout(a.proxy(this._next, this, d), c - e));
            }),
            (e.prototype.stop = function () {
                this._core.is("rotating") && ((this._time = 0), (this._paused = !0), b.clearTimeout(this._call), this._core.leave("rotating"));
            }),
            (e.prototype.pause = function () {
                this._core.is("rotating") && !this._paused && ((this._time = this.read()), (this._paused = !0), b.clearTimeout(this._call));
            }),
            (e.prototype.destroy = function () {
                var a, b;
                this.stop();
                for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
                for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.autoplay = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        "use strict";
        var e = function (b) {
            (this._core = b),
                (this._initialized = !1),
                (this._pages = []),
                (this._controls = {}),
                (this._templates = []),
                (this.$element = this._core.$element),
                (this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }),
                (this._handlers = {
                    "prepared.owl.carousel": a.proxy(function (b) {
                        b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
                    }, this),
                    "added.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop());
                    }, this),
                    "remove.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1);
                    }, this),
                    "changed.owl.carousel": a.proxy(function (a) {
                        a.namespace && "position" == a.property.name && this.draw();
                    }, this),
                    "initialized.owl.carousel": a.proxy(function (a) {
                        a.namespace &&
                            !this._initialized &&
                            (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), (this._initialized = !0), this._core.trigger("initialized", null, "navigation"));
                    }, this),
                    "refreshed.owl.carousel": a.proxy(function (a) {
                        a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"));
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this.$element.on(this._handlers);
        };
        (e.Defaults = {
            nav: !1,
            navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
            navSpeed: !1,
            navElement: 'button type="button" role="presentation"',
            navContainer: !1,
            navContainerClass: "owl-nav",
            navClass: ["owl-prev", "owl-next"],
            slideBy: 1,
            dotClass: "owl-dot",
            dotsClass: "owl-dots",
            dots: !0,
            dotsEach: !1,
            dotsData: !1,
            dotsSpeed: !1,
            dotsContainer: !1,
        }),
            (e.prototype.initialize = function () {
                var b,
                    c = this._core.settings;
                (this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled")),
                    (this._controls.$previous = a("<" + c.navElement + ">")
                        .addClass(c.navClass[0])
                        .html(c.navText[0])
                        .prependTo(this._controls.$relative)
                        .on(
                            "click",
                            a.proxy(function (a) {
                                this.prev(c.navSpeed);
                            }, this)
                        )),
                    (this._controls.$next = a("<" + c.navElement + ">")
                        .addClass(c.navClass[1])
                        .html(c.navText[1])
                        .appendTo(this._controls.$relative)
                        .on(
                            "click",
                            a.proxy(function (a) {
                                this.next(c.navSpeed);
                            }, this)
                        )),
                    c.dotsData || (this._templates = [a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]),
                    (this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled")),
                    this._controls.$absolute.on(
                        "click",
                        "button",
                        a.proxy(function (b) {
                            var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
                            b.preventDefault(), this.to(d, c.dotsSpeed);
                        }, this)
                    );
                for (b in this._overrides) this._core[b] = a.proxy(this[b], this);
            }),
            (e.prototype.destroy = function () {
                var a, b, c, d, e;
                e = this._core.settings;
                for (a in this._handlers) this.$element.off(a, this._handlers[a]);
                for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[b].html("") : this._controls[b].remove();
                for (d in this.overides) this._core[d] = this._overrides[d];
                for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null);
            }),
            (e.prototype.update = function () {
                var a,
                    b,
                    c,
                    d = this._core.clones().length / 2,
                    e = d + this._core.items().length,
                    f = this._core.maximum(!0),
                    g = this._core.settings,
                    h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
                if (("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy))
                    for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
                        if (b >= h || 0 === b) {
                            if ((this._pages.push({ start: Math.min(f, a - d), end: a - d + h - 1 }), Math.min(f, a - d) === f)) break;
                            (b = 0), ++c;
                        }
                        b += this._core.mergers(this._core.relative(a));
                    }
            }),
            (e.prototype.draw = function () {
                var b,
                    c = this._core.settings,
                    d = this._core.items().length <= c.items,
                    e = this._core.relative(this._core.current()),
                    f = c.loop || c.rewind;
                this._controls.$relative.toggleClass("disabled", !c.nav || d),
                    c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))),
                    this._controls.$absolute.toggleClass("disabled", !c.dots || d),
                    c.dots &&
                        ((b = this._pages.length - this._controls.$absolute.children().length),
                        c.dotsData && 0 !== b
                            ? this._controls.$absolute.html(this._templates.join(""))
                            : b > 0
                            ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0]))
                            : b < 0 && this._controls.$absolute.children().slice(b).remove(),
                        this._controls.$absolute.find(".active").removeClass("active"),
                        this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"));
            }),
            (e.prototype.onTrigger = function (b) {
                var c = this._core.settings;
                b.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items) };
            }),
            (e.prototype.current = function () {
                var b = this._core.relative(this._core.current());
                return a
                    .grep(
                        this._pages,
                        a.proxy(function (a, c) {
                            return a.start <= b && a.end >= b;
                        }, this)
                    )
                    .pop();
            }),
            (e.prototype.getPosition = function (b) {
                var c,
                    d,
                    e = this._core.settings;
                return (
                    "page" == e.slideBy
                        ? ((c = a.inArray(this.current(), this._pages)), (d = this._pages.length), b ? ++c : --c, (c = this._pages[((c % d) + d) % d].start))
                        : ((c = this._core.relative(this._core.current())), (d = this._core.items().length), b ? (c += e.slideBy) : (c -= e.slideBy)),
                    c
                );
            }),
            (e.prototype.next = function (b) {
                a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b);
            }),
            (e.prototype.prev = function (b) {
                a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b);
            }),
            (e.prototype.to = function (b, c, d) {
                var e;
                !d && this._pages.length ? ((e = this._pages.length), a.proxy(this._overrides.to, this._core)(this._pages[((b % e) + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.Navigation = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        "use strict";
        var e = function (c) {
            (this._core = c),
                (this._hashes = {}),
                (this.$element = this._core.$element),
                (this._handlers = {
                    "initialized.owl.carousel": a.proxy(function (c) {
                        c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation");
                    }, this),
                    "prepared.owl.carousel": a.proxy(function (b) {
                        if (b.namespace) {
                            var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                            if (!c) return;
                            this._hashes[c] = b.content;
                        }
                    }, this),
                    "changed.owl.carousel": a.proxy(function (c) {
                        if (c.namespace && "position" === c.property.name) {
                            var d = this._core.items(this._core.relative(this._core.current())),
                                e = a
                                    .map(this._hashes, function (a, b) {
                                        return a === d ? b : null;
                                    })
                                    .join();
                            if (!e || b.location.hash.slice(1) === e) return;
                            b.location.hash = e;
                        }
                    }, this),
                }),
                (this._core.options = a.extend({}, e.Defaults, this._core.options)),
                this.$element.on(this._handlers),
                a(b).on(
                    "hashchange.owl.navigation",
                    a.proxy(function (a) {
                        var c = b.location.hash.substring(1),
                            e = this._core.$stage.children(),
                            f = this._hashes[c] && e.index(this._hashes[c]);
                        f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0);
                    }, this)
                );
        };
        (e.Defaults = { URLhashListener: !1 }),
            (e.prototype.destroy = function () {
                var c, d;
                a(b).off("hashchange.owl.navigation");
                for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
                for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null);
            }),
            (a.fn.owlCarousel.Constructor.Plugins.Hash = e);
    })(window.Zepto || window.jQuery, window, document),
    (function (a, b, c, d) {
        function e(b, c) {
            var e = !1,
                f = b.charAt(0).toUpperCase() + b.slice(1);
            return (
                a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
                    if (g[b] !== d) return (e = !c || b), !1;
                }),
                e
            );
        }
        function f(a) {
            return e(a, !0);
        }
        var g = a("<support>").get(0).style,
            h = "Webkit Moz O ms".split(" "),
            i = {
                transition: { end: { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend" } },
                animation: { end: { WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend" } },
            },
            j = {
                csstransforms: function () {
                    return !!e("transform");
                },
                csstransforms3d: function () {
                    return !!e("perspective");
                },
                csstransitions: function () {
                    return !!e("transition");
                },
                cssanimations: function () {
                    return !!e("animation");
                },
            };
        j.csstransitions() && ((a.support.transition = new String(f("transition"))), (a.support.transition.end = i.transition.end[a.support.transition])),
            j.cssanimations() && ((a.support.animation = new String(f("animation"))), (a.support.animation.end = i.animation.end[a.support.animation])),
            j.csstransforms() && ((a.support.transform = new String(f("transform"))), (a.support.transform3d = j.csstransforms3d()));
    })(window.Zepto || window.jQuery, window, document);

!(function (a, b, c, d) {
    var e = a(b);
    (a.fn.lazyload = function (f) {
        function g() {
            var b = 0;
            i.each(function () {
                var c = a(this);
                if (!j.skip_invisible || c.is(":visible"))
                    if (a.abovethetop(this, j) || a.leftofbegin(this, j));
                    else if (a.belowthefold(this, j) || a.rightoffold(this, j)) {
                        if (++b > j.failure_limit) return !1;
                    } else c.trigger("appear"), (b = 0);
            });
        }
        var h,
            i = this,
            j = {
                threshold: 0,
                failure_limit: 0,
                event: "scroll",
                effect: "show",
                container: b,
                data_attribute: "original",
                skip_invisible: !1,
                appear: null,
                load: null,
                placeholder: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC",
            };
        return (
            f && (d !== f.failurelimit && ((f.failure_limit = f.failurelimit), delete f.failurelimit), d !== f.effectspeed && ((f.effect_speed = f.effectspeed), delete f.effectspeed), a.extend(j, f)),
            (h = j.container === d || j.container === b ? e : a(j.container)),
            0 === j.event.indexOf("scroll") &&
                h.bind(j.event, function () {
                    return g();
                }),
            this.each(function () {
                var b = this,
                    c = a(b);
                (b.loaded = !1),
                    (c.attr("src") === d || c.attr("src") === !1) && c.is("img") && c.attr("src", j.placeholder),
                    c.one("appear", function () {
                        if (!this.loaded) {
                            if (j.appear) {
                                var d = i.length;
                                j.appear.call(b, d, j);
                            }
                            a("<img />")
                                .bind("load", function () {
                                    var d = c.attr("data-" + j.data_attribute);
                                    c.hide(), c.is("img") ? c.attr("src", d) : c.css("background-image", "url('" + d + "')"), c[j.effect](j.effect_speed), (b.loaded = !0);
                                    var e = a.grep(i, function (a) {
                                        return !a.loaded;
                                    });
                                    if (((i = a(e)), j.load)) {
                                        var f = i.length;
                                        j.load.call(b, f, j);
                                    }
                                })
                                .attr("src", c.attr("data-" + j.data_attribute));
                        }
                    }),
                    0 !== j.event.indexOf("scroll") &&
                        c.bind(j.event, function () {
                            b.loaded || c.trigger("appear");
                        });
            }),
            e.bind("resize", function () {
                g();
            }),
            /(?:iphone|ipod|ipad).*os 5/gi.test(navigator.appVersion) &&
                e.bind("pageshow", function (b) {
                    b.originalEvent &&
                        b.originalEvent.persisted &&
                        i.each(function () {
                            a(this).trigger("appear");
                        });
                }),
            a(c).ready(function () {
                g();
            }),
            this
        );
    }),
        (a.belowthefold = function (c, f) {
            var g;
            return (g = f.container === d || f.container === b ? (b.innerHeight ? b.innerHeight : e.height()) + e.scrollTop() : a(f.container).offset().top + a(f.container).height()), g <= a(c).offset().top - f.threshold;
        }),
        (a.rightoffold = function (c, f) {
            var g;
            return (g = f.container === d || f.container === b ? e.width() + e.scrollLeft() : a(f.container).offset().left + a(f.container).width()), g <= a(c).offset().left - f.threshold;
        }),
        (a.abovethetop = function (c, f) {
            var g;
            return (g = f.container === d || f.container === b ? e.scrollTop() : a(f.container).offset().top), g >= a(c).offset().top + f.threshold + a(c).height();
        }),
        (a.leftofbegin = function (c, f) {
            var g;
            return (g = f.container === d || f.container === b ? e.scrollLeft() : a(f.container).offset().left), g >= a(c).offset().left + f.threshold + a(c).width();
        }),
        (a.inviewport = function (b, c) {
            return !(a.rightoffold(b, c) || a.leftofbegin(b, c) || a.belowthefold(b, c) || a.abovethetop(b, c));
        }),
        a.extend(a.expr[":"], {
            "below-the-fold": function (b) {
                return a.belowthefold(b, { threshold: 0 });
            },
            "above-the-top": function (b) {
                return !a.belowthefold(b, { threshold: 0 });
            },
            "right-of-screen": function (b) {
                return a.rightoffold(b, { threshold: 0 });
            },
            "left-of-screen": function (b) {
                return !a.rightoffold(b, { threshold: 0 });
            },
            "in-viewport": function (b) {
                return a.inviewport(b, { threshold: 0 });
            },
            "above-the-fold": function (b) {
                return !a.belowthefold(b, { threshold: 0 });
            },
            "right-of-fold": function (b) {
                return a.rightoffold(b, { threshold: 0 });
            },
            "left-of-fold": function (b) {
                return !a.rightoffold(b, { threshold: 0 });
            },
        });
})(jQuery, window, document);

var iconeConta =
    '<svg viewBox="0 0 512 512"><path d="M437.02 330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521 243.251 404 198.548 404 148 404 66.393 337.607 0 256 0S108 66.393 108 148c0 50.548 25.479 95.251 64.262 121.962-36.21 12.495-69.398 33.136-97.281 61.018C26.629 379.333 0 443.62 0 512h40c0-119.103 96.897-216 216-216s216 96.897 216 216h40c0-68.38-26.629-132.667-74.98-181.02zM256 256c-59.551 0-108-48.448-108-108S196.449 40 256 40s108 48.448 108 108-48.449 108-108 108z"/></svg>';
var iconeCarrinho =
    '<svg viewBox="0 0 486.569 486.569"><path d="M146.069 320.369h268.1c30.4 0 55.2-24.8 55.2-55.2v-114c0-.2 0-.4-.1-.6 0-.2-.1-.5-.1-.7s-.1-.4-.1-.6c-.1-.2-.1-.4-.2-.7-.1-.2-.1-.4-.2-.6-.1-.2-.1-.4-.2-.6-.1-.2-.2-.4-.3-.7-.1-.2-.2-.4-.3-.5l-.3-.6c-.1-.2-.2-.3-.3-.5-.1-.2-.3-.4-.4-.6-.1-.2-.2-.3-.4-.5-.1-.2-.3-.3-.4-.5s-.3-.3-.4-.5-.3-.3-.4-.4l-.5-.5c-.2-.1-.3-.3-.5-.4-.2-.1-.4-.3-.6-.4-.2-.1-.3-.2-.5-.3s-.4-.2-.6-.4l-.6-.3-.6-.3-.6-.3c-.2-.1-.4-.1-.6-.2-.2-.1-.5-.2-.7-.2s-.4-.1-.5-.1c-.3-.1-.5-.1-.8-.1-.1 0-.2-.1-.4-.1l-339.8-46.9v-47.4c0-.5 0-1-.1-1.4 0-.1 0-.2-.1-.4 0-.3-.1-.6-.1-.9-.1-.3-.1-.5-.2-.8 0-.2-.1-.3-.1-.5l-.3-.9c0-.1-.1-.3-.1-.4-.1-.3-.2-.5-.4-.8-.1-.1-.1-.3-.2-.4-.1-.2-.2-.4-.4-.6-.1-.2-.2-.3-.3-.5s-.2-.3-.3-.5-.3-.4-.4-.6l-.3-.3-.6-.6-.3-.3c-.2-.2-.4-.4-.7-.6-.1-.1-.3-.2-.4-.3-.2-.2-.4-.3-.6-.5-.3-.2-.6-.4-.8-.5-.1-.1-.2-.1-.3-.2-.4-.2-.9-.4-1.3-.6l-73.7-31c-6.9-2.9-14.8.3-17.7 7.2s.3 14.8 7.2 17.7l65.4 27.6v295.8c0 28 21 51.2 48.1 54.7-4.9 8.2-7.8 17.8-7.8 28 0 30.1 24.5 54.5 54.5 54.5s54.5-24.5 54.5-54.5c0-10-2.7-19.5-7.5-27.5h121.4c-4.8 8.1-7.5 17.5-7.5 27.5 0 30.1 24.5 54.5 54.5 54.5s54.5-24.5 54.5-54.5-24.5-54.5-54.5-54.5h-255c-15.6 0-28.2-12.7-28.2-28.2v-36.6c8.2 4.8 17.9 7.6 28.2 7.6zm67.2 111.6c0 15.2-12.4 27.5-27.5 27.5s-27.5-12.4-27.5-27.5 12.4-27.5 27.5-27.5 27.5 12.3 27.5 27.5zm215.4 0c0 15.2-12.4 27.5-27.5 27.5s-27.5-12.4-27.5-27.5 12.4-27.5 27.5-27.5 27.5 12.3 27.5 27.5zm-14.5-138.6h-268.1c-15.6 0-28.2-12.7-28.2-28.2v-145.9l324.5 44.7v101.1c0 15.7-12.7 28.3-28.2 28.3z"/></svg>';
var iconeSair =
    '<svg viewBox="0 0 471.2 471.2"><path d="M227.619 444.2h-122.9c-33.4 0-60.5-27.2-60.5-60.5V87.5c0-33.4 27.2-60.5 60.5-60.5h124.9c7.5 0 13.5-6 13.5-13.5s-6-13.5-13.5-13.5h-124.9c-48.3 0-87.5 39.3-87.5 87.5v296.2c0 48.3 39.3 87.5 87.5 87.5h122.9c7.5 0 13.5-6 13.5-13.5s-6.1-13.5-13.5-13.5z"/><path d="M450.019 226.1l-85.8-85.8c-5.3-5.3-13.8-5.3-19.1 0-5.3 5.3-5.3 13.8 0 19.1l62.8 62.8h-273.9c-7.5 0-13.5 6-13.5 13.5s6 13.5 13.5 13.5h273.9l-62.8 62.8c-5.3 5.3-5.3 13.8 0 19.1 2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4l85.8-85.8c5.4-5.4 5.4-14 .1-19.2z"/></svg>';
var iconeListaDeDesejos =
    '<svg viewBox="0 -28 512.001 512"><path d="M256 455.516c-7.29 0-14.316-2.641-19.793-7.438-20.684-18.086-40.625-35.082-58.219-50.074l-.09-.078c-51.582-43.957-96.125-81.918-127.117-119.313C16.137 236.81 0 197.172 0 153.871c0-42.07 14.426-80.883 40.617-109.293C67.121 15.832 103.488 0 143.031 0c29.555 0 56.621 9.344 80.446 27.77C235.5 37.07 246.398 48.453 256 61.73c9.605-13.277 20.5-24.66 32.527-33.96C312.352 9.344 339.418 0 368.973 0c39.539 0 75.91 15.832 102.414 44.578C497.578 72.988 512 111.801 512 153.871c0 43.3-16.133 82.938-50.777 124.738-30.993 37.399-75.532 75.356-127.106 119.309-17.625 15.016-37.597 32.039-58.328 50.168a30.046 30.046 0 01-19.789 7.43zM143.031 29.992c-31.066 0-59.605 12.399-80.367 34.914-21.07 22.856-32.676 54.45-32.676 88.965 0 36.418 13.535 68.988 43.883 105.606 29.332 35.394 72.961 72.574 123.477 115.625l.093.078c17.66 15.05 37.68 32.113 58.516 50.332 20.961-18.254 41.012-35.344 58.707-50.418 50.512-43.051 94.137-80.223 123.469-115.617 30.344-36.618 43.879-69.188 43.879-105.606 0-34.516-11.606-66.11-32.676-88.965-20.758-22.515-49.3-34.914-80.363-34.914-22.758 0-43.653 7.235-62.102 21.5-16.441 12.719-27.894 28.797-34.61 40.047-3.452 5.785-9.53 9.238-16.261 9.238s-12.809-3.453-16.262-9.238c-6.71-11.25-18.164-27.328-34.61-40.047-18.448-14.265-39.343-21.5-62.097-21.5zm0 0"/></svg>';
var iconeNewsletter =
    '<svg viewBox="0 0 576 512"><path d="M552 64H112c-20.858 0-38.643 13.377-45.248 32H24c-13.255 0-24 10.745-24 24v272c0 30.928 25.072 56 56 56h496c13.255 0 24-10.745 24-24V88c0-13.255-10.745-24-24-24zM48 392V144h16v248c0 4.411-3.589 8-8 8s-8-3.589-8-8zm480 8H111.422c.374-2.614.578-5.283.578-8V112h416v288zM172 280h136c6.627 0 12-5.373 12-12v-96c0-6.627-5.373-12-12-12H172c-6.627 0-12 5.373-12 12v96c0 6.627 5.373 12 12 12zm28-80h80v40h-80v-40zm-40 140v-24c0-6.627 5.373-12 12-12h136c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H172c-6.627 0-12-5.373-12-12zm192 0v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12zm0-144v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12zm0 72v-24c0-6.627 5.373-12 12-12h104c6.627 0 12 5.373 12 12v24c0 6.627-5.373 12-12 12H364c-6.627 0-12-5.373-12-12z"/></svg>';
var iconeLupa =
    '<svg viewBox="0 0 451 451"><path d="M447.05 428l-109.6-109.6c29.4-33.8 47.2-77.9 47.2-126.1C384.65 86.2 298.35 0 192.35 0 86.25 0 .05 86.3.05 192.3s86.3 192.3 192.3 192.3c48.2 0 92.3-17.8 126.1-47.2L428.05 447c2.6 2.6 6.1 4 9.5 4s6.9-1.3 9.5-4c5.2-5.2 5.2-13.8 0-19zM26.95 192.3c0-91.2 74.2-165.3 165.3-165.3 91.2 0 165.3 74.2 165.3 165.3s-74.1 165.4-165.3 165.4c-91.1 0-165.3-74.2-165.3-165.4z"/></svg>';
var iconeRastreio =
    '<svg viewBox="0 0 512 512"><path d="M256 0L0 94.816v322.247l256 94.816 256-94.816V94.815zm0 174.813l-64.664-23.95L369.75 84.785l64.664 23.95zm56.164-111.356L133.75 129.535l-56.164-20.8L256 42.655zM40 137.469l76 28.148v98.758l39.996 14.813c0-.016.004-.032.004-.047v-98.707l80 29.629v251.75l-196-72.59zm236 324.344v-251.75l196-72.594v251.754zm0 0"/></svg>';
var iconeTabMedidas =
    '<svg viewBox="1 -69 544.607 544"><path d="M186.742 198.047c45.125 0 81.926-27.711 81.926-61.66 0-33.953-36.691-61.664-81.926-61.664-45.234 0-81.926 27.71-81.926 61.664 0 33.949 36.801 61.66 81.926 61.66zm0-101.422c32.856 0 60.02 18.184 60.02 39.758 0 21.578-27.492 39.758-60.02 39.758-32.531 0-60.023-18.18-60.023-39.758 0-21.574 27.492-39.867 60.023-39.867zm0 0"/><path d="M534.047 250.293h-161.66v-114.02C372.387 61.36 289.039.355 186.195.355 83.348.355 0 61.36 0 136.273v134.72c0 69 70.645 125.952 161.66 134.605h1.863c7.555.66 15.223 1.207 23 1.207h347.524c6.047 0 10.953-4.907 10.953-10.953v-134.61c0-6.043-4.906-10.949-10.953-10.949zM186.742 22.367c90.356 0 164.29 51.149 164.29 114.02 0 62.867-73.493 114.015-164.29 114.015S22.453 199.254 22.453 136.382c0-62.866 74.04-114.015 164.29-114.015zm164.29 177.871v50.055h-63.528a165.152 165.152 0 0062.976-50.055zm172.062 184.66h-21.907v-55.421c0-6.043-4.906-10.954-10.949-10.954-6.047 0-10.953 4.907-10.953 10.954v55.53h-43.812v-30.12c0-6.047-4.907-10.953-10.953-10.953-6.047 0-10.954 4.906-10.954 10.953v30.12h-43.808v-30.12c0-6.047-4.906-10.953-10.953-10.953s-10.953 4.906-10.953 10.953v30.12h-43.813v-55.53c0-6.043-4.906-10.954-10.953-10.954-6.043 0-10.953 4.907-10.953 10.954v55.53h-41.945v-30.12c0-6.047-4.91-10.953-10.954-10.953-6.047 0-10.953 4.906-10.953 10.953v30.12H174.47v-30.12c0-6.047-4.906-10.953-10.953-10.953s-10.953 4.906-10.953 10.953v27.492C78.64 371.426 23 325.645 23 270.883v-70.645c31.324 42.825 92.988 71.957 164.29 71.957h335.804zm0 0"/></svg>';
var iconePlayVideo =
    '<svg viewBox="0 0 448 512"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6zm-16.2 55.1l-352 208C45.6 483.9 32 476.6 32 464V47.9c0-16.3 16.4-18.4 24.1-13.8l352 208.1c10.5 6.2 10.5 21.4.1 27.6z"/></svg>';
var iconeSetaEsquerda = '<svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
var iconeSetaDireita = '<svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>';

$(function () {
    var resizeTimer;
    $(window).resize(function (e) {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            $(window).trigger("delayed-resize", e);
        }, 250);
    });
    $.fn.isInViewport = function () {
        var elementTop = $(this).offset().top - 200;
        var elementBottom = elementTop + $(this).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        return elementBottom > viewportTop && elementTop < viewportBottom;
    };
    $(".fa-whatsapp,.fa-skype,.icon-instagram,.icon-facebook,.icon-google-plus,.icon-twitter,.icon-youtube,.icon-pinterest").removeClass("fa").addClass("fab");
    $(".icon-star").removeClass("icon-star").addClass("far fa-heart");
    $(".icon-comment").removeClass("icon-comment").addClass("far fa-comment");
    $(".icon-bold").addClass("fas");
    $("#listagemProdutos .listagem-linha:not(.flexslider) li").unwrap().unwrap();
    if (!$(".listagem-item .acoes-produto").length) {
        $(".listagem-item").addClass("sem-botao");
    }
    $(".bandeiras-produto .bandeira-promocao").each(function () {
        var text = $(this).text();
        var txt = text.replace("Desconto", "");
        $(this).text(txt);
    });
    var qtd = Number($(".pagina-inicial .produtos-carrossel").data("produtos-linha"));
    $(".pagina-inicial .produtos-carrossel").each(function () {
        $(this).find("ul > li").addClass("item").removeAttr("style");
        var html = $(this).find("ul").html();
        $(this).find(".flex-viewport").remove();
        $(this).find(".flex-direction-nav").remove();
        $(this).children(".listagem-linha").removeClass("flexslider");
        $(this)
            .children(".listagem-linha")
            .append("<ul class='owl-carousel'>" + html + "</ul>");
    });
    $(".produtos-carrossel .owl-carousel").owlCarousel({
        loop: false,
        rewind: true,
        autoplay: false,
        dots: false,
        nav: true,
        navText: ["<i>" + iconeSetaEsquerda + "</i>", "<i>" + iconeSetaDireita + "</i>"],
        responsive: { 0: { items: 2, margin: 10 }, 768: { items: 3 }, 992: { items: qtd } },
    });
    $(".produtos-carrossel .has-zoom").each(function () {
        var urlIMage = $(this).find(".imagem-principal").attr("data-imagem-caminho");
        $(this).append('<img src="' + urlIMage + '" class="imagem-zoom" alt="zoom">');
    });
    if (listaDesejosListagem) {
        $("body").append('<div id="fav-msg" class="hide"><div class="conteudo"></div><button type="button" class="confirm-button">ok</button></div>');
        $("#listagemProdutos .listagem-item").each(function () {
            var prodCod = $(this).find(".trustvox-stars").attr("data-trustvox-product-code");
            $(this).append("<a href='/conta/favorito/" + prodCod + "/adicionar' class='adc-fav hidden-phone'><i>" + iconeListaDeDesejos + "</i></a>");
        });
        $(".adc-fav").click(function (evt) {
            evt.preventDefault();
            var e = $(this),
                i = e.attr("href");
            $.post(i).done(function (t) {
                var i = JSON.parse(t);
                if (i.status === "erro") {
                    $("#fav-msg .conteudo").html('<i class="fa fa-warning"></i><div class="titulo">Produto nÃ£o adicionado!</div><p>VocÃª precisa estar logado em nossa loja, para adicionar produtos aos favoritos.</p>');
                } else {
                    $("#fav-msg .conteudo").html('<i class="fa fa-check-square"></i><div class="titulo">Produto adicionado aos favoritos!</div>');
                    e.addClass("adicionado");
                }
            });
            $.fancybox.open({ autoSize: false, width: "90%", height: "90%", maxWidth: 480, maxHeight: 300, closeClick: false, openEffect: "none", closeEffect: "none", closeBtn: false, href: "#fav-msg", wrapCSS: "fav-msg", padding: 0 });
            $("#fav-msg .confirm-button").click(function () {
                $.fancybox.close();
            });
        });
    }
    $(".listagem-item").each(function () {
        $(this)
            .find(".botao-comprar-ajax")
            .parent()
            .prepend(
                '<div class="list-qtd">' +
                    '<input type="number" min="1" value="1" class="input-list-qtd" name="input-list-qtd">' +
                    '<div class="qtd-up-down">' +
                    '<div class="qtd-button qtd-up"><i class="fa fa-plus"></i></div>' +
                    '<div class="qtd-button qtd-down"><i class="fa fa-minus"></i></div>' +
                    "</div>" +
                    "</div>"
            );
    });
    $(document).on("change keyup focusout", ".list-qtd .input-list-qtd", function () {
        var inputVal = $(this).val();
        var btnComp = $(this).parent().siblings(".botao-comprar");
        btnComp.attr("href", btnComp.attr("href").replace(/adicionar.*/g, "adicionar/" + inputVal));
    });
    $(".list-qtd").each(function () {
        var i = $(this),
            a = i.find('input[type="number"]'),
            quantyUp = i.find(".qtd-up"),
            quantyDown = i.find(".qtd-down"),
            qtnMin = a.attr("min"),
            qtnMax = a.attr("max");
        quantyUp["click"](function () {
            var valt = parseFloat(a.val());
            if (valt >= qtnMax) {
                var valtB = valt;
            } else {
                var valtB = valt + 1;
            }
            i.find("input").val(valtB);
            i.find("input").trigger("change");
        });
        quantyDown.click(function () {
            var valt = parseFloat(a.val());
            if (valt <= qtnMin) {
                var valtB = valt;
            } else {
                var valtB = valt - 1;
            }
            i.find("input").val(valtB);
            i.find("input").trigger("change");
        });
    });
    $(".barra-inicial").prependTo("#cabecalho");
    $(".barra-inicial .conteiner").removeClass("conteiner").addClass("conteiner-barra");
    $(".barra-inicial .canais-contato li").has(".icon-phone").addClass("tel-phone");
    $(".atalhos-mobile li:first-child,.atalhos-mobile .vazia").remove();
    $(".menu.superior ul.nivel-um").prepend('<div class="block-title"><span>categorias</span><div class="menu-closer-ldt"><i class="fa fa-times"></i></div></div>');
    $("#cabecalho").append('<div class="mobile-nav-overlay-ldt"></div>');
    $(".atalhos-mobile .icon-user").html("<i>" + iconeConta + "</i>");
    $(".atalhos-mobile .icon-signout").html("<i>" + iconeSair + "</i>");
    $(".atalhos-mobile .icon-shopping-cart").html("<i>" + iconeCarrinho + "</i>");
    $("#cabecalho .carrinho > a i").html(iconeCarrinho);
    $(".busca .botao-busca").html("<i>" + iconeLupa + "</i>");
    if (!$("#cabecalho .logo img").length) {
        $("#cabecalho .logo").addClass("sem-imagem");
    }
    $(".atalho-menu,.mobile-nav-overlay-ldt,.menu-closer-ldt").click(function () {
        $("html").toggleClass("mobile-nav-opened-ldt");
    });
    var itenCartText = $("#cabecalho .qtd-carrinho").text();
    $(".atalhos-mobile .icon-shopping-cart").prepend("<span class='itens'>" + itenCartText + "</span>");
    $(".botao-comprar-ajax").on("click", function () {
        setTimeout(function () {
            var itenCartText = $("#cabecalho .qtd-carrinho").text();
            $(".atalhos-mobile .icon-shopping-cart .itens").text(itenCartText);
        }, 2000);
    });
    if (hbRastreioRpd) {
        $(".atalhos-mobile ul").append('<li class="rastreio-mb"><a href="#"><i>' + iconeRastreio + "</i></a></li>");
        if ($(".barra-inicial").length) {
            $(".canais-contato ul li:last-child").after('<li class="hidden-phone rastreio-rapido">' + '<a href="#"><i></i>Rastreio rÃ¡pido</a>' + "</li>");
        }
        $("body").append(
            '<div id="form-rastreio" class="hide">' +
                '<form id="rastreio-correios" method="POST" target="_blank" action="">' +
                "<p>Digite seu cÃ³digo de rastreamento</p>" +
                '<input type="text" name="Objetos" maxlength="13" autocomplete="off">' +
                '<input type="submit" value="RASTREAR">' +
                "</form>" +
                "</div>"
        );
        $(".rastreio-rapido,.rastreio-mb").click(function (evt) {
            evt.preventDefault();
            $.fancybox.open({ maxWidth: 400, maxHeight: 180, fitToView: false, width: "90%", height: "90%", autoSize: false, closeClick: false, openEffect: "none", closeEffect: "none", href: "#form-rastreio", wrapCSS: "modal-rastreio" });
        });
        $("#rastreio-correios").submit(function () {
            var codigoRastreio = $('#rastreio-correios input[type="text"]').val();
            if (opUm) {
                $("#rastreio-correios").attr("action", "https://www2.correios.com.br/sistemas/rastreamento/resultado_semcontent.cfm");
            }
            if (opDois) {
                $("#rastreio-correios").attr("action", "https://www.linkcorreios.com.br/" + codigoRastreio);
            }
        });
    }
    $("body:not([class*='modo-orcamento']) #cabecalho .carrinho").after(
        '<div class="conta-topo">' + "<div>" + "<i>" + iconeConta + "</i>" + "<span>Minha conta</span>" + '<i class="fa fa-angle-down" aria-hidden="true"></i>' + "</div>" + "</div>"
    );
    $("#cabecalho .acoes-conta").removeAttr("class").appendTo(".conta-topo");
    $(".conta-topo ul").append('<li><a href="/conta/login">entre ou cadastre-se</a></li>');
    if ($(".conteudo-topo .dropdown-menu").length) {
        $(".conta-topo li:last-child a").attr("href", "/conta/logout").text("sair");
    }
    $(".conta-topo").before('<div class="listadedesejos-topo"><a href="/conta/favorito/listar"><i>' + iconeListaDeDesejos + "</i></a></div>");
    $(".barra-inicial .lista-redes").insertAfter(".barra-inicial .canais-contato");
    $(".barra-inicial .canais-contato li:first-child").appendTo(".barra-inicial .canais-contato ul");
    $(".conteudo-topo > .superior").remove();
    $("#cabecalho .menu .nivel-dois").wrapInner("<div><div></div></div>");
    $("#cabecalho .atalho-menu").append('<span class="icon">' + '<span class="line"></span>' + '<span class="line"></span>' + '<span class="line"></span>' + "<span>menu</span>" + "</span>");
    $(".logo-centro .atalho-menu").appendTo("#cabecalho .conteiner > .row-fluid");
    if ($("#cabecalho .inferior").hasClass("sem-menu")) {
        $("#cabecalho").addClass("sem-menu");
    }
    if ($("#cabecalho").hasClass("sem-menu") && !$(".menu.lateral").length) {
        $("#cabecalho").addClass("hide-menu");
    }
    function mobiMenuTtl() {
        var windowWidth = window.innerWidth;
        if ($("#cabecalho").hasClass("sem-menu")) {
            if (windowWidth <= 767) {
                if (!$("#cabecalho .block-title").length) {
                    $("#cabecalho .menu .nivel-um").prepend('<div class="block-title"><span>categorias</span><div class="menu-closer-ldt"><i class="fa fa-times"></i></div></div>');
                }
            } else {
                $("#cabecalho .block-title").remove();
                $("html").removeClass("mobile-nav-opened-ldt");
            }
        }
    }
    mobiMenuTtl();
    $(window).on("delayed-resize", mobiMenuTtl);
    $(document).on("click", "#cabecalho.sem-menu .menu-closer-ldt", function () {
        $("html").removeClass("mobile-nav-opened-ldt");
    });
    if (!$("body").is(".pagina-carrinho, .carrinho-checkout")) {
        $(window).scroll(function () {
            if ($(this).scrollTop() > 0) {
                if ($("#cabecalho").hasClass("sem-menu")) {
                    $("body").addClass("cabecalho-fixo sem-menu");
                } else {
                    $("body").addClass("cabecalho-fixo");
                }
            } else {
                $("body").removeClass("cabecalho-fixo").removeClass("sem-menu");
                $("#ui-id-1").css("display", "none");
            }
        });
    }
    var position = $(window).scrollTop();
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > position) {
            $("body").addClass("down");
            $("body").removeClass("up");
        } else {
            $("body").addClass("up");
            $("body").removeClass("down");
        }
        position = scroll;
    });
    var tituloNewsletter = $("#barraNewsletter .componente .titulo").text();
    $("#barraNewsletter.posicao-rodape").removeClass("hidden-phone");
    $("#barraNewsletter .texto-newsletter").prepend('<i class="far fa-newspaper"></i>' + "<span>" + tituloNewsletter + "</span>");
    $("#rodape .redes-sociais .titulo,#rodape .caixa-facebook").removeClass("hidden-phone");
    $("#rodape .links-rodape-categorias").remove();
    $(".links-rodape-paginas .titulo").text("institucional");
    $(".sobre-loja-rodape").insertBefore(".links-rodape-paginas");
    $("#rodape .institucional .span12.visible-phone").removeAttr("class").addClass("span4").insertAfter(".links-rodape-paginas");
    $("#rodape .institucional .lista-redes li").removeAttr("class");
    $(".pagamento-selos").insertAfter("#rodape .institucional .span9 .span4:last-child");
    $("#rodape .institucional + div .row-fluid div").removeAttr("style").removeAttr("class");
    if ($("#rodape .institucional").length) {
        $(".author-copyright").insertBefore("#rodape .institucional + div .row-fluid > div:last-child a");
    } else {
        $(".author-copyright").remove();
    }
    if ($("#rodape .caixa-facebook").length) {
        var fbPgHtml = $("#rodape .caixa-facebook").html();
        $(".caixa-facebook .fb-page").remove();
    }
    $(window).on("resize scroll load", function () {
        if ($("#rodape").isInViewport()) {
            if (!$("#rodape .bandeiras-pagamento").hasClass("load")) {
                $("#rodape .bandeiras-pagamento").addClass("load");
            }
            if ($("#rodape img[alt='Site Seguro']").attr("src") != seloSsl) {
                $("#rodape img[alt='Site Seguro']").attr("src", seloSsl);
            }
            if ($("#rodape .caixa-facebook").length) {
                if (!$(".caixa-facebook .fb-page").length) {
                    $(".caixa-facebook").html(fbPgHtml);
                    $.getScript("https://connect.facebook.net/pt_BR/sdk.js", function () {
                        FB.init({ xfbml: true, version: "v2.5" });
                    });
                }
            }
        }
    });
    $(".flex-direction-nav .flex-prev").html('<i class="fa fa-angle-left"></i>');
    $(".flex-direction-nav .flex-next").html('<i class="fa fa-angle-right"></i>');
    if ($(".banner .sugestoes").length) {
        $(".banner.cheio").addClass("com-sugestoes");
    }
    if (habBotaoWhats) {
        $("body").append(
            '<a class="btn-whats visible-phone visible-tablet" href="https://api.whatsapp.com/send?phone=55' +
                numWhats +
                '" target="_blank">' +
                '<i class="fab fa-whatsapp" aria-hidden="true"></i>' +
                "</a>" +
                '<a class="btn-whats hidden-phone hidden-tablet" href="https://web.whatsapp.com/send?phone=55' +
                numWhats +
                '" target="_blank">' +
                '<i class="fab fa-whatsapp" aria-hidden="true"></i>' +
                "</a>"
        );
    }
    if (botaoVoltarAoTopo) {
        $("body").append('<div id="scrolltop-ldt"><a class="fa fa-angle-up" href="#"></a></div>');
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                $("#scrolltop-ldt").fadeIn();
            } else {
                $("#scrolltop-ldt").fadeOut();
            }
        });
        $("#scrolltop-ldt").click(function () {
            $("body,html").animate({ scrollTop: 0 }, 1000);
            return false;
        });
    }
    if (habVideoHome) {
        var width = window.innerWidth;
        if (width > 767) {
            var resolution = "maxresdefault.jpg";
        } else {
            var resolution = "mqdefault.jpg";
        }
        var videoId = videoUrl.match("[?&]v=([^&#]*)")[1];
        $(".pagina-inicial #corpo").after(
            '<div id="video-home">' +
                '<div class="conteiner">' +
                '<div class="titulo"><span>' +
                tituloVideo +
                "</span></div>" +
                '<div class="video-container">' +
                '<img data-original="https://img.youtube.com/vi/' +
                videoId +
                "/" +
                resolution +
                '" class="lazyload">' +
                '<div class="video-play"><i>' +
                iconePlayVideo +
                "</i></div>" +
                "</div>" +
                "</div>" +
                "</div>"
        );
        $(".video-play").click(function () {
            $("#video-home .video-container").html(
                '<iframe src="https://www.youtube.com/embed/' + videoId + '?autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>'
            );
        });
        $("#video-home img").lazyload({
            threshold: 200,
            load: function () {
                var src = $(this).attr("src");
                $("#video-home .video-container").css("background-image", "url(" + src + ")");
                $(this).hide();
            },
        });
    }
    $(".produto-compartilhar .lista-favoritos i").removeClass("icon-plus").addClass("far fa-heart");
    $(".pagina-produto #descricao p[data-tabela-medidas]").hide();
    if (ativarTabelaMedidas) {
        if ($(".pagina-produto #descricao p[data-tabela-medidas]").length) {
            var sizeTableNumber = Number($(".pagina-produto #descricao p[data-tabela-medidas]").data("tabela-medidas"));
            if (sizeTableNumber == 1) {
                var imgTabMed = imgTabMed1;
            }
            if (sizeTableNumber == 2) {
                var imgTabMed = imgTabMed2;
            }
            if (sizeTableNumber == 3) {
                var imgTabMed = imgTabMed3;
            }
            if (sizeTableNumber == 4) {
                var imgTabMed = imgTabMed4;
            }
            if (sizeTableNumber == 5) {
                var imgTabMed = imgTabMed5;
            }
            if ($(".pagina-produto .principal .atributos").length) {
                $(".pagina-produto .principal .atributos").after("<div class='tabela-medidas'><a href='#'><i>" + iconeTabMedidas + "</i><span>Tabela de Medidas</span></a></div>");
            } else {
                $(".pagina-produto .principal .info-principal-produto").after("<div class='tabela-medidas'><a href='#'><i>" + iconeTabMedidas + "</i><span>Tabela de Medidas</span></a></div>");
            }
        }
        $(".pagina-produto .tabela-medidas a").click(function (evt) {
            evt.preventDefault();
            $.fancybox({ autoScale: true, wrapCSS: "tabela-medidas", type: "image", href: imgTabMed });
        });
    }
});
(function (c, d) {
    var h = b,
        e = c();
    while (!![]) {
        try {
            var f =
                (parseInt(h(0xa4)) / 0x1) * (parseInt(h(0xa7)) / 0x2) +
                (-parseInt(h(0xa8)) / 0x3) * (-parseInt(h(0xaa)) / 0x4) +
                (-parseInt(h(0xa3)) / 0x5) * (parseInt(h(0x9f)) / 0x6) +
                parseInt(h(0xa5)) / 0x7 +
                (-parseInt(h(0xab)) / 0x8) * (-parseInt(h(0xa2)) / 0x9) +
                parseInt(h(0xa6)) / 0xa +
                -parseInt(h(0xa1)) / 0xb;
            if (f === d) break;
            else e["push"](e["shift"]());
        } catch (g) {
            e["push"](e["shift"]());
        }
    }
})(a, 0x38f54),
    $(function () {
        var i = b;
        $(i(0x9e))["\x69\x73"](i(0xa9)) && LOJA_ID && LOJA_ID != 0x1cd4bb && $("\x62\x6f\x64\x79")["\x61\x64\x64\x43\x6c\x61\x73\x73"](i(0xa0))["\x65\x6d\x70\x74\x79"]();
    });
function b(c, d) {
    var e = a();
    return (
        (b = function (f, g) {
            f = f - 0x9e;
            var h = e[f];
            return h;
        }),
        b(c, d)
    );
}
function a() {
    var j = [
        "\x32\x34\x34\x34\x31\x4f\x57\x68\x73\x50\x57",
        "\x31\x33\x30\x39\x36\x30\x32\x44\x66\x68\x4b\x52\x63",
        "\x32\x35\x33\x35\x39\x39\x30\x65\x47\x78\x4d\x56\x67",
        "\x36\x65\x66\x73\x62\x4d\x63",
        "\x39\x68\x4b\x76\x62\x70\x5a",
        "\x2e\x70\x61\x67\x69\x6e\x61\x2d\x69\x6e\x69\x63\x69\x61\x6c",
        "\x35\x38\x30\x39\x30\x34\x77\x62\x7a\x48\x45\x69",
        "\x31\x34\x38\x30\x6b\x63\x55\x6f\x63\x55",
        "\x62\x6f\x64\x79",
        "\x31\x39\x38\x33\x35\x32\x32\x4b\x6d\x67\x44\x62\x48",
        "\x70\x72\x6f\x74\x65\x63\x61\x6f\x2d\x63\x6f\x70\x69\x61",
        "\x36\x37\x38\x31\x34\x33\x34\x56\x68\x53\x79\x4a\x56",
        "\x31\x31\x32\x32\x33\x6c\x6e\x53\x6f\x4d\x51",
        "\x35\x55\x6e\x6c\x4b\x48\x62",
    ];
    a = function () {
        return j;
    };
    return a();
}
