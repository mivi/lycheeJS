
lychee.define('game.state.GameBlast').requires([
	'game.scene.GameBlast',
	'game.scene.Overlay',
	'game.scene.UI'
]).includes([
	'lychee.game.State'
]).exports(function(lychee, global) {

	var Class = function(game) {

		lychee.game.State.call(this, game, 'menu');

		this.__input    = this.game.input;
		this.__jukebox  = this.game.jukebox;
		this.__loop     = this.game.loop;
		this.__renderer = this.game.renderer;

		this.__clock = 0;

		this.reset();

	};


	Class.prototype = {

		reset: function() {

			this.__game    = new game.scene.GameBlast(this.game, this.game.settings.game);
			this.__overlay = new game.scene.Overlay(this.game, this.game.settings.game);
			this.__ui      = new game.scene.UI(this.game, this.game.settings.ui);

		},

		enter: function(data) {

			lychee.game.State.prototype.enter.call(this);


			this.__game.enter(data);
			this.__overlay.enter();
			this.__ui.enter();


			this.__locked = true;


			if (this.game.settings.music === true) {
				this.game.jukebox.fadeIn('music', 2000, true, 0.5);
			}


			this.__input.bind('touch', this.__processTouch, this);
			this.__renderer.start();

		},

		leave: function() {

			this.__renderer.stop();
			this.__input.unbind('touch', this.__processTouch);


			this.__game.leave();
			this.__overlay.leave();
			this.__ui.leave();


			if (this.game.jukebox.isPlaying('music')) {
				this.game.jukebox.fadeOut('music', 2000);
			}

			lychee.game.State.prototype.leave.call(this);

		},

		update: function(clock, delta) {

			this.__game.update(clock, delta);
			this.__overlay.update(clock, delta);
			this.__ui.update(clock, delta);


			// Wait for completion of user interaction
			if (
				this.__overlay.isVisible() === false
				&& this.__locked === false
			) {

				// game.Score instance is allowed for public access
				this.__ui.score.subtract('time', delta);


				// Time is over, change the state
				if (this.__ui.score.get('time') < 0) {
					this.game.setState('result', this.__ui.score.get());
				}

			// Overlay faded out, so user can interact with game
			} else if (this.__overlay.isVisible() === false) {
				this.__locked = false;
			}


			this.__clock = clock;

		},

		render: function(clock, delta) {

			this.__renderer.clear();


			this.__game.render(clock, delta);

			if (this.__overlay.isVisible() === true) {
				this.__overlay.render(clock, delta);
			}

			this.__ui.render(clock, delta);


			this.__renderer.flush();

		},

		__processTouch: function(position, delta) {

			if (this.__locked === true) return;

			var gameOffset = this.game.getOffset();

			position.x -= gameOffset.x;
			position.y -= gameOffset.y;


			var dimensions = this.game.settings.game;

			if (
				position.x > 0
				&& position.x < dimensions.width
				&& position.y > 0
				&& position.y < dimensions.height
			) {


			}

		}

	};


	return Class;

});
