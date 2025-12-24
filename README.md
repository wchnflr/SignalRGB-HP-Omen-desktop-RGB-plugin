I created this plugin because HP OMEN Gaming Hub and HP OMEN Light Studio do not have the ability to control the CPU cooler fan connected to the proprietary USB RGB LED controller. This same RGB controller is used on multiple generations of HP Omen desktops. The pinouts on the RGB LED controller are also proprietary.

This project got its breakthrough moment from:
https://www.reddit.com/r/HPOmen/comments/nirgwa/a_way_to_change_hp_omen_lighting_with_a_python/

And also the SignalRGB plugins tutorials:
https://docs.signalrgb.com/plugins

This plugin controls:
1. Front diamond logo
2. Interior light bar
3. CPU cooler fan
4. Unassigned RGB for a front fan light not installed in my 25L

Installation instructions:
1. Save HP_Omen_Desktop_RGB.js to C:\Users\[YOUR USERNAME]\Documents\WhirlwindFX\Plugins or in the WhirlwindFX\Plugins folder wherever your Documents folder is located. https://docs.signalrgb.com/plugins/how-is-a-plugin-loaded-
2. Restart SignalRGB.
3. Click on Devices at left under System.
4. Scroll down to Other Devices to look for HP Omen Desktop RGB.
