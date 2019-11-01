let isX = function(x, y){
    const d = Math.atan(y / x)

    if( d > 0.7 || d < -0.7){
        return false
    } else {
        return true
    }
}

const hyEvents = {
    install(Vue){
        Vue.directive('hyWheel',{
            inserted: function(el, binding){
                let f = function(e){
                    const x = e.deltaX
                    const y = e.deltaY

                    if( !isX(x, y) ){
                        if( y < 0 && binding.modifiers.up ){
                            binding.value(e)
                        } else if( y > 0 && binding.modifiers.down ){
                            binding.value(e)
                        }
                    } else {
                        if( x > 0 && binding.modifiers.left ){
                            binding.value(e)
                        } else if( x < 0 && binding.modifiers.right ){
                            binding.value(e)
                        }
                    }
                }
                el.addEventListener('wheel', f)
            }
        })

        Vue.directive('hySweep',{
            inserted: function(el, binding){
                let sX = null
                let sY = null

                let start = function(e){
                    sX = e.changedTouches[0].screenX
                    sY = e.changedTouches[0].screenY
                }

                let end = function(e){
                    const x = sX - e.changedTouches[0].screenX
                    const y = sY - e.changedTouches[0].screenY
                    const d = Math.abs(x + y)

                    if( d > 20 ){
                        if( !isX(x, y) ){
                            if( y < 0 && binding.modifiers.up ){
                                binding.value(e)
                            } else if( y > 0 && binding.modifiers.down ){
                                binding.value(e)
                            }
                        } else {
                            if( x > 0 && binding.modifiers.left ){
                                binding.value(e)
                            } else if( x < 0 && binding.modifiers.right ){
                                binding.value(e)
                            }
                        }
                    }

                }

                el.addEventListener('touchstart', start)
                el.addEventListener('touchend', end)
            }
        })
    }
}

export default hyEvents;
