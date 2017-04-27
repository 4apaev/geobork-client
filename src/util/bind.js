module.exports = (ctx, ...methods) => {
    methods.forEach(method => {
      if ('function'===typeof ctx[ method ])
        ctx[ method ] = ctx[ method ].bind(ctx)
    })
    return ctx
  }