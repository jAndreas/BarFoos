#BarFoos#

BarFoos is a Javascript application framework. Features are:

    - ECMAscript edition 5 normalization
    - Allows for a loosely coupled architecture
    - Uses browser css transitions to animate stuff (when available)
    - Lots of neat helper methods

The Core of BarFoos is shipped with an integrated mediator. When used 
correctly, you can simply plug in and out any module on your site 
without affecting other modules. So everything keeps working.

Furthermore, the architecture of BarFoos is designed to switch any core 
layer aswell very easily. By default, BarFoos uses jQuery as it's "base 
library" to abstract browser differences. If you're writting a module, 
you don't care about the base library at all. The special "Sandbox" 
object is everything a module is able to see of the application. So if 
there is a need to switch the base library, you would only need to adapt 
the Core and Sandbox. All of your modules keep calling the same methods and will
therefore continue to work.

The basic idea here is, that you break down your website into lots of small
areas. Each area is represented through a BarFoos module. The module now
only cares about its own tasks and has no idea about the web application as
a hole. Communication only happens through the Sandbox via a mediator and
event types. That technique also enables you to work simultaneously on
different areas (modules) with several people. There is no tightly coupled
relationship between modules. That guarantees any change that was made in
an "inter module communication", cannot crash your application.

The Core easily can get extended by plugins.
