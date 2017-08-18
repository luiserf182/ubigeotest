var ubigeoPeruList = new Array();

var departments = new Array();
var provinces = new Array();
var districts = new Array();

let contentFile = document.getElementById('contentFile');
let inputFile = document.getElementById('btn_uploadfile');
let uploadFileInput = document.getElementById("uploadFileInput");

uploadFileInput.addEventListener('change', readTxtFile, false);
contentFile.addEventListener('dragover', e => e.preventDefault());
contentFile.addEventListener('drop', readTxtFile);

function readTxtFile(e) {
    ubigeoPeruList = [];
    departments = [];
    provinces = [];
    districts = [];
    document.getElementById("tableContent").innerHTML = '';
	var file;
	if (e.type === 'change')
		file = e.target.files[0];
	else
		file = e.dataTransfer.files[0];

    if (file.type !== 'text/plain')
        return alert("The files you've just dragged are not supported.");

    var fileReader = new FileReader();
    fileReader.onloadend = () => printFileContents(fileReader.result);
    fileReader.readAsText(file, 'ISO-8859-1');
    return e.preventDefault();
}

function printFileContents(contents) {
    var lines = contents.split(/\n/);

    lines.forEach(function (x) {
        var string = x.toString();
        if (string.indexOf('/')) {
            buildUbigeoItem(string);
        }
    });

    buildDataBeforeBuildtable();

    buildTable(departments, 'Departments');
    buildTable(provinces, 'Provinces');
    buildTable(districts, 'Districts');
}

function buildDataBeforeBuildtable() {

    departments = ubigeoPeruList.filter(x => x.departament !== '00' && x.province === '00' && x.district === '00');
    provinces = ubigeoPeruList.filter(x => x.departament !== '00' && x.province !== '00' && x.district === '00');
    districts = ubigeoPeruList.filter(x => x.departament !== '00' && x.province !== '00' && x.district !== '00');

    departments.forEach(function (x) {
        x.parentCode = '--';
        x.parentName = '--';
    });

    provinces.forEach(function(x) {
        departments.forEach(function (y) {
            if (x.department === y.department) {
                x.parentCode = y.department;
                x.parentName = y.name;
            }
        });
    });

    districts.forEach(function (x) {
        provinces.forEach(function (y) {
            if (x.province === y.province) {
                x.parentCode = y.province;
                x.parentName = y.name;
            }
        });
    });
}

function cleanUbigeoData(string) {    
    return string.replace(/“|”/g, '').trim();
}

function buildUbigeoItem(string) {
    string = cleanUbigeoData(string);
    var ubigeoPart = string.split('/');

    var dep = ubigeoPart[0].trim();
    var pro = ubigeoPart[1].trim();
    var dis = ubigeoPart[2].trim();

    var departmentCode = '';
    var provinceCode = '';    
    var districtCode = '';
    var name = "";

    if (dis != undefined && dis !== '') {
        name = dis.split(' ').splice(1).join(' ');
        districtCode = dis.split(' ')[0];
    } else
        districtCode = '00';

    if (pro != undefined && pro !== '') {
        provinceCode = pro.split(' ')[0];
        if (name === '')
            name = pro.split(' ').splice(1).join(' ');
    } else
        provinceCode = '00';

    if (dep != undefined && dep !== '') {
        departmentCode = dep.split(' ')[0];
        if (name === '')
        name = dep.split(' ').splice(1).join(' ');
    } else
        departmentCode = '00';

    ubigeoPeruList.push({ 'department': departmentCode, 'province': provinceCode, 'district': districtCode, 'name': name });
}

function buildTable(data, title) {
    var dat = data;
    var htmlstr = "<table>" +
        "<caption style='border: 1px solid #ddd; font-size: 18px; padding: 5px 0'>" + title + "</caption>" +
        "<thead><tr>" +
        "<th>Code</th>" +
        "<th>Name</th>" +
        "<th>Parent Code</th>" +
        "<th>Parent Code Name</th>" +
        "</tr></thead>" +
        "<tbody>";
    for (var i = 0; i < dat.length; ++i) {
        htmlstr += "<tr>" +
            "<td>" + dat[i].department + "</td>" +
            "<td>" + dat[i].name + "</td>" +
            "<td>" + dat[i].parentCode + "</td>" +
            "<td>" + dat[i].parentName + "</td>" +
            "</tr>";
    }
    htmlstr += "</tbody></table>";
    document.getElementById("tableContent").insertAdjacentHTML("beforeend", htmlstr);
}