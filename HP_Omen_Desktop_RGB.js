export function Name() { return "HP Omen Desktop RGB"; }
export function VendorId() { return 0x103c; }
export function ProductId() { return 0x84fd; }
export function Publisher() { return "babamonchu"; }
export function Documentation(){ return "troubleshooting/hp"; }
export function Size() { return [1,4]; }
export function DefaultPosition(){return [150, 50]; }
export function DefaultScale(){return 2.0}
export function ControllableParameters() {
	return [
		{"property":"shutdownColor", "group":"lighting", "label":"Shutdown Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
		{"property":"LightingMode", "group":"lighting", "label":"Lighting Mode", "type":"combobox", "values":["Canvas", "Forced"], "default":"Canvas"},
		{"property":"forcedColor", "group":"lighting", "label":"Forced Color", "min":"0", "max":"360", "type":"color", "default":"009bde"},
	];
}

export function Initialize() {
}

// CN1 CPU cooler fan
// CN2 Front diamond
// CN3 No connect
// CN4A Interiror light bar
var vLedNames = [ "Diamond", "Light Bar", "Unassigned", "CPU Cooler" ]; 
var vLedPositions = [ [0,1], [0,0], [0,2], [0,3] ];

export function LedNames() {
	return vLedNames;
}

export function LedPositions() {
	return vLedPositions;
}

export function Render() {
	sendColors();
}

export function Shutdown() {
    if (SystemSuspending) {
        sendColors("#000000"); // Go Dark on System Sleep/Shutdown
    }
	else {
        sendColors(shutdownColor);
    }
}

function hexToRgb(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	let colors = [];
	colors[0] = parseInt(result[1], 16);
	colors[1] = parseInt(result[2], 16);
	colors[2] = parseInt(result[3], 16);
	return colors;
}

export function Validate(endpoint) {
	return endpoint.interface === 0x00 && endpoint.usage === 0x00 && endpoint.usage_page === 0x0001;
}

export function ImageUrl() {
	return "https://brandcentral.hp.com/content/dam/sites/brand-central/elem-sub-brands/images/omen_1.jpg";
}

// Packet assignments from https://www.reddit.com/r/HPOmen/comments/nirgwa/a_way_to_change_hp_omen_lighting_with_a_python/
function sendColors(shutdown = false)
{
    let packet = [];
    packet[0] = 0x00 // Data 0 - Report ID , Always 0
    packet[1] = 0x3e // data 1 - 0x3e from Wireshark
    packet[2] = 0x12 // data 2 - 0x12 from Wireshark
    packet[3] = 0x01 // data 3 - Change LED rotation type - Breathing (0x06), Color Cycle (0x07), Blinking (0x08), Static (0x01) etc
    packet[4] = 0x01 // data 4 - Custom Color Count - only used for custom colors leave at 0x01
    packet[5] = 0x01 // data 5 - Custom Color Number - only used for custom colors leave at 0x01
    packet[6] = 0x00 // data 6 - 0x00 from Wireshark
    packet[7] = 0x00 // data 7 - 0x00 from Wireshark

	for (let zone_idx = 0; zone_idx < vLedPositions.length; zone_idx++) {
		let iX = vLedPositions[zone_idx][0];
		let iY = vLedPositions[zone_idx][1];
		var col;

		if (shutdown) {
			col = hexToRgb(shutdownColor);
		}
		else if (LightingMode === "Forced") {
			col = hexToRgb(forcedColor);
		}
		else {
			col = device.color(iX, iY);
		}
		packet[(zone_idx * 3) + 8] = col[0];
		packet[(zone_idx * 3) + 9] = col[1];
		packet[(zone_idx * 3) + 10] = col[2];
	}
//    packet[8] = col[0] // data 8 - Front Diamond Red Value in hex, Leave at 0x00 for other modes
//    packet[9] = col[1] // data 9 - Front Diamond Green Value in hex, Leave at 0x00 for other modes
//    packet[10] = col[2] // data 10 - Front Diamond Blue Value in hex, Leave at 0x00 for other modes
//    packet[11] = col[0] // data 11 - Light Bar Red Value in hex, Leave at 0x00 for other modes
//    packet[12] = col[1] // data 12 - Light Bar Green Value in hex, Leave at 0x00 for other modes
//    packet[13] = col[2] // data 13 - Light Bar Blue Value in hex, Leave at 0x00 for other modes
//    packet[14] = col[0] // data 14 - Unknown Red Value in hex, Leave at 0x00 for other modes
//    packet[15] = col[1] // data 15 - Unknown Green Value in hex, Leave at 0x00 for other modes
//    packet[16] = col[2] // data 16 - Unknown Blue Value in hex, Leave at 0x00 for other modes
//    packet[17] = col[0] // data 17 - CPU Cooler Red Value in hex, Leave at 0x00 for other modes
//    packet[18] = col[1] // data 18 - CPU Cooler Green Value in hex, Leave at 0x00 for other modes
//    packet[19] = col[2] // data 19 - CPU Cooler Blue Value in hex, Leave at 0x00 for other modes
    packet[48] = 0x64 // data 48 - Changes Brightness 25% (0x19), 50% (0x32), 75% (0x4b), 100% (0x64)
    packet[49] = 0x02 // data 49 - 0x0a or 0x04 for system vitals, constantly changing stuff - leave at 0x0a; 0x02 for static color
    packet[50] = 0x00 // data 50 - 0x00 from Wireshark
    packet[51] = 0x00 // data 51 - 0x00 from Wireshark
    packet[52] = 0x00 // data 52 - 0x00 from Wireshark
    packet[53] = 0x00 // data 53 - 0x00 from Wireshark
    packet[54] = 0x00 // data 54 - LED Module ID - Front is 0x01, Inside LED Bar is 0x02, CPU Cooler is 0x04, All lights is 0x00
    packet[55] = 0x01 // data 55 - 0x01 for the lighting for the computer is on. 0x02 when the computer is suspend.
    packet[56] = 0x00 // data 56 - Changes the Theme - Galaxy (0x01), Volcano (0x02), Jungle (0x03), Ocean (0x04) etc.; 0x00 from Wireshark
    packet[57] = 0x00 // data 57 - Changes the speed Slow (0x01), Medium (0x02), Fast (0x03); 0x00 from Wireshark
    device.write(packet, 58);
}
