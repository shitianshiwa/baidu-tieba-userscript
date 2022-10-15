// Interval Looper by Jixun:
// https://gist.github.com/JixunMoe/c77bb3936a68997fce22

var IntervalLoop = function (arrData, looper, delay) {
	if (!(this instanceof IntervalLoop))
		return new IntervalLoop (arrData, looper, delay);
 
	/**
	 * Status
	 * @type Number
	 * 0: 循环未开始
	 * 1: 正在循环
	 * 2: 循环结束
	 */
	this.status = 0;
	this.next = this._next.bind (this);
	this.index = 0;
 
	this.setDelay (delay || 50);
	this.data = (arrData instanceof Array) ? arrData : [];
	this.setLooper (looper);
};
 
IntervalLoop.prototype = {
	_getDelay: function () {
		if (!this.delay)
			return 50;
 
		if (this.delay.apply)
			return this.delay();
 
		return this.delay;
	},
	_next: function () {
		// 状态改为 进行中
		this.status = 1;
		if (this.index < this.data.length) {
			setTimeout (this.looper.bind(this, this.data[this.index]), this.delay);
			this.index ++;
			if (this.onProgress && this.onProgress.apply) {
				try {
					this.onProgress (this.index, this.data.length);
				} catch (e) {
					console.error ('Error while callback to `onProgress`');
					console.error (e);
				}
			}
		} else {
			this.status = 2;
			if (this.onComplete && this.onComplete.apply) {
				try {
					this.onComplete (this.data.length);
				} catch (e) {
					console.error ('Error while callback to `onComplete`');
					console.error (e);
				}
			}
		}
	},
	cleanup: function () {
		if (this.status == 2) {
			// 已经用过的数据就清掉。
			this.data.splice(0, this.index);
			this.index = 0;
			this.status = 0;
		}
 
		return this;
	},
	add: function () {
		if (arguments.length > 0) {
			// 将所有参数作为数据推入 this.data
			for (var i = 0; i<arguments.length; i++)
				this.data.push (arguments[i]);
 
			// 整个组已经完结，清理后自动继续
			if (this.status == 2)
				this.cleanup().next();
		}
 
		// 连锁
		return this;
	},
	setDelay: function (newDelay) {
		if (newDelay) this.delay = parseInt (newDelay);
		return this;
	},
	setLooper: function (fooCallback) {
		if (fooCallback && fooCallback.apply)
			this.looper = fooCallback.bind(this, this.next);
 
		return this;
	},
	loop: function () {
		if (this.status == 0)
			// 尚未启动, 从头开始
			this.next ();
 
		return this;
	}
};