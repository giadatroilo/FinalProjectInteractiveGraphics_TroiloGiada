function GetModelViewMatrix( translationX, translationY, translationZ, rotationX, rotationY )
{
	var transl= [
		[1, 0, 0, translationX],
		[0, 1, 0, translationY],
		[0, 0, 1, translationZ],
		[0, 0, 0, 1]
	];
	
	var rotx=[
		[1, 0, 0, 0],
		[0, Math.cos(-rotationX), Math.sin(-rotationX), 0],
		[0, -Math.sin(-rotationX), Math.cos(-rotationX), 0], 
		[0, 0, 0, 1]
	];

	var roty=[
		[Math.cos(-rotationY), 0, -Math.sin(-rotationY), 0 ],
		[0, 1, 0, 0],
		[Math.sin(-rotationY), 0, Math.cos(-rotationY), 0 ],
		[0, 0, 0, 1]
	];

	transl = ColumnMajorOrder(transl);
	rotx = ColumnMajorOrder(rotx);
	roty = ColumnMajorOrder(roty)
	
	var trans1 = MatrixMult(transl, rotx);  
    var trans2 = MatrixMult(trans1, roty);    

	var mv = trans2;
	return mv;
}

function ColumnMajorOrder(matri){
	var vec=[];
	var righe=matri.length;
	var colonne=matri[0].length;
	for (var j=0; j<colonne; j++){
		for (var i=0; i<righe; i++){
			vec.push(matri[i][j]);  
		}
	}

	return vec;
}

class MeshDrawer {
    // The constructor is a good place for taking care of the necessary initializations.
    constructor() {
        // Initialize shader program
        this.prog = InitShaderProgram(meshVS, meshFS);

        // Get the IDs of the uniform variables in the shaders
        this.mvp = gl.getUniformLocation(this.prog, 'mvp');
        this.showTextureUniform = gl.getUniformLocation(this.prog, 'showTexture');
        this.mv = gl.getUniformLocation(this.prog, 'mv');
        this.normalMatrix = gl.getUniformLocation(this.prog, 'normalMatrix');

        // Get the IDs of the vertex attributes in the shaders
        this.vertPos = gl.getAttribLocation(this.prog, 'vertPos');
        this.texCoord = gl.getAttribLocation(this.prog, 'texCoord');
        this.vertNormal = gl.getAttribLocation(this.prog, 'vertNormal');

        // Create the buffer objects
        this.vertexBuffer = gl.createBuffer();
        this.textureCoordBuffer = gl.createBuffer();
        this.normalBuffer = gl.createBuffer();

        // Initialize other variables
        this.texture = null;
        this.showTextureFlag = true;
        this.numTriangles = 0;
    }

    // This method is called every time the user opens an OBJ file.
    // The arguments of this function are an array of 3D vertex positions
    // and an array of 3D texture coordinates.
    // Every item in these arrays is a floating point value, representing one
    // coordinate of the vertex position or texture coordinate.
    // Every three consecutive elements in the vertPos array form one vertex
    // position, and every three consecutive vertex positions form a triangle.
    // Similarly, every three consecutive elements in the texCoords array
    // form the texture coordinate of a vertex.
    // Note that this method can be called multiple times.
    setMesh(vertPos, texCoords, normals) {
        this.numTriangles = vertPos.length / 3;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPos), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

   // This method is called to draw the triangular mesh.
	// The arguments are the model-view-projection transformation matrixMVP,
	// the model-view transformation matrixMV, the same matrix returned
	// by the GetModelViewProjection function above, and the normal
	// transformation matrix, which is the inverse-transpose of matrixMV.
	draw(matrixMVP, matrixMV, matrixNormal) {
        gl.useProgram(this.prog);

        gl.uniformMatrix4fv(this.mvp, false, matrixMVP);
        gl.uniformMatrix4fv(this.mv, false, matrixMV);
        gl.uniformMatrix3fv(this.normalMatrix, false, matrixNormal);
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.enableVertexAttribArray(this.vertPos);
        gl.vertexAttribPointer(this.vertPos, 3, gl.FLOAT, false, 0, 0);
            
        if (this.showTextureFlag && this.texture) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
            gl.enableVertexAttribArray(this.texCoord);
            gl.vertexAttribPointer(this.texCoord, 2, gl.FLOAT, false, 0, 0);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.uniform1i(gl.getUniformLocation(this.prog, 'texSampler'), 0);

            gl.uniform1i(this.showTextureUniform, 1);
        } else {
            gl.uniform1i(this.showTextureUniform, 0);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
        gl.enableVertexAttribArray(this.vertNormal);
        gl.vertexAttribPointer(this.vertNormal, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.TRIANGLES, 0, this.numTriangles);
    }

    // This method is called to set the texture of the mesh.
    // The argument is an HTML IMG element containing the texture data.
    setTexture(img) {
        // Bind the texture
        this.texture = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.uniform1i(gl.getUniformLocation(this.prog, 'texSampler'), 0);
        // You can set the texture image data using the following command.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }

    // This method is called when the user changes the state of the
    // "Show Texture" checkbox.
    // The argument is a boolean that indicates if the checkbox is checked.
    showTexture(show) { this.showTextureFlag = show;
       gl.useProgram(this.prog);
       gl.uniform1i(gl.getUniformLocation(this.prog, 'showTexture'), show ? 1 : 0);
    }

    // This method is called to set the incoming light direction
    setLightDir(x, y, z) {
        gl.useProgram(this.prog);
        gl.uniform3f(gl.getUniformLocation(this.prog, 'lightDir'), x, y, z);
    }

    // This method is called to set the shininess of the material
    setShininess(shininess) {
        gl.useProgram(this.prog);
        gl.uniform1f(gl.getUniformLocation(this.prog, 'shininess'), shininess);
    }
}

// Vertex shader source code
var meshVS = `
    attribute vec3 vertPos;
    attribute vec2 texCoord;
    attribute vec3 vertNormal;
    uniform mat4 mvp;
    uniform mat4 mv;
    uniform mat3 normalMatrix;
    varying vec2 fragTexCoord;
    varying vec3 normal;
    varying vec3 fragPos;

    void main() {
        vec4 pos = vec4(vertPos, 1.0);
            gl_Position = mvp * pos;
            normal = normalMatrix * vertNormal;
            fragPos = (mv * pos).xyz;
        
        fragTexCoord = texCoord;
    }
`;

// Fragment shader source code
var meshFS = `
    precision mediump float;
    uniform sampler2D texSampler;
    uniform int showTexture;
    uniform vec3 lightDir; 
    uniform float shininess; 
    varying vec2 fragTexCoord;
    varying vec3 normal;
    varying vec3 fragPos;

    void main() {
        vec3 I = vec3(1.0, 1.0, 1.0);
        vec3 K = vec3(1.0, 1.0, 1.0);
        vec3 N = normalize(normal);   
        vec3 L = normalize(lightDir);
        
        float diff = max(dot(N, L), 0.0);

        vec3 V = normalize(-fragPos);
        vec3 H = normalize(L + V);
        vec3 spec = I * K * pow(max(dot(N, H), 0.0), shininess);

        if (showTexture == 1) {
            vec4 texColor = texture2D(texSampler, fragTexCoord);
            vec3 diffuseColor = I * diff * texColor.rgb;
            vec3 finalColor = diffuseColor + spec;
            gl_FragColor = vec4(finalColor, texColor.a);
        } else {
            vec3 diffuseColor = I * vec3(1.0, 1.0, 1.0) * diff; 
            vec3 finalColor = diffuseColor + spec;
            gl_FragColor = vec4(finalColor, 1.0);
        }
    }
`;


var lightView;

class LightView
{
	constructor()
	{
		this.canvas = document.getElementById("lightcontrol");
		this.canvas.oncontextmenu = function() {return false;};
		this.gl = this.canvas.getContext("webgl", {antialias: false, depth: true});	// Initialize the GL context
		if (!this.gl) {
			alert("Unable to initialize WebGL. Your browser or machine may not support it.");
			return;
		}
		
		// Initialize settings
		this.gl.clearColor(0.33,0.33,0.33,0);
		this.gl.enable(gl.DEPTH_TEST);
		
		this.rotX = 0;
		this.rotY = 0;
		this.posZ = 5;
		
		this.resCircle = 32;
		this.resArrow = 16;
		this.buffer = this.gl.createBuffer();
		var data = [];
		for ( var i=0; i<=this.resCircle; ++i ) {
			var a = 2 * Math.PI * i / this.resCircle;
			var x = Math.cos(a);
			var y = Math.sin(a);
			data.push( x * .9 );
			data.push( y * .9 );
			data.push( 0 );
			data.push( x );
			data.push( y );
			data.push( 0 );
		}
		for ( var i=0; i<=this.resCircle; ++i ) {
			var a = 2 * Math.PI * i / this.resCircle;
			var x = Math.cos(a);
			var y = Math.sin(a);
			data.push( x );
			data.push( y );
			data.push( -.05 );
			data.push( x );
			data.push( y );
			data.push( 0.05 );
		}
		for ( var i=0; i<=this.resArrow; ++i ) {
			var a = 2 * Math.PI * i / this.resArrow;
			var x = Math.cos(a) * .07;
			var y = Math.sin(a) * .07;
			data.push( x );
			data.push( y );
			data.push( -1 );
			data.push( x );
			data.push( y );
			data.push( 0 );
		}
		data.push( 0 );
		data.push( 0 );
		data.push( -1.2 );
		for ( var i=0; i<=this.resArrow; ++i ) {
			var a = 2 * Math.PI * i / this.resArrow;
			var x = Math.cos(a) * .15;
			var y = Math.sin(a) * .15;
			data.push( x );
			data.push( y );
			data.push( -0.9 );
		}
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
		this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
		
		// Set the viewport size
		this.canvas.style.width  = "";
		this.canvas.style.height = "";
		const pixelRatio = window.devicePixelRatio || 1;
		this.canvas.width  = pixelRatio * this.canvas.clientWidth;
		this.canvas.height = pixelRatio * this.canvas.clientHeight;
		const width  = (this.canvas.width  / pixelRatio);
		const height = (this.canvas.height / pixelRatio);
		this.canvas.style.width  = width  + 'px';
		this.canvas.style.height = height + 'px';
		this.gl.viewport( 0, 0, this.canvas.width, this.canvas.height );
		this.proj = ProjectionMatrix( this.canvas, this.posZ, 30 );
		
		// Compile the shader program
		this.prog = InitShaderProgram( lightViewVS, lightViewFS, this.gl );
		this.mvp = this.gl.getUniformLocation( this.prog, 'mvp' );
		this.clr1 = this.gl.getUniformLocation( this.prog, 'clr1' );
		this.clr2 = this.gl.getUniformLocation( this.prog, 'clr2' );
		this.vertPos = this.gl.getAttribLocation( this.prog, 'pos' );
		
		this.draw();
		this.updateLightDir();
		
		this.canvas.onmousedown = function() {
			var cx = event.clientX;
			var cy = event.clientY;
			lightView.canvas.onmousemove = function() {
				lightView.rotY += (cx - event.clientX)/lightView.canvas.width*5;
				lightView.rotX += (cy - event.clientY)/lightView.canvas.height*5;
				cx = event.clientX;
				cy = event.clientY;
				lightView.draw();
				lightView.updateLightDir();
			}
		}
		this.canvas.onmouseup = this.canvas.onmouseleave = function() {
			lightView.canvas.onmousemove = null;
		}
	}
	
	updateLightDir()
	{
		var cy = Math.cos( this.rotY );
		var sy = Math.sin( this.rotY );
		var cx = Math.cos( this.rotX );
		var sx = Math.sin( this.rotX );
		meshDrawer.setLightDir( -sy, cy*sx, -cy*cx );
		DrawScene();
	}
	
	draw()
	{
		// Clear the screen and the depth buffer.
		this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );
		
		this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );
		this.gl.vertexAttribPointer( this.vertPos, 3, this.gl.FLOAT, false, 0, 0 );
		this.gl.enableVertexAttribArray( this.buffer );

		this.gl.useProgram( this.prog );
		var mvp = MatrixMult( this.proj, [ 1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,this.posZ,1 ] );
		this.gl.uniformMatrix4fv( this.mvp, false, mvp );
		this.gl.uniform3f( this.clr1, 0.6,0.6,0.6 );
		this.gl.uniform3f( this.clr2, 0,0,0 );
		this.gl.drawArrays( this.gl.TRIANGLE_STRIP, 0, this.resCircle*2+2 );

		var mv  = GetModelViewMatrix( 0, 0, this.posZ, this.rotX, this.rotY );
		var mvp = MatrixMult( this.proj, mv );
		this.gl.uniformMatrix4fv( this.mvp, false, mvp );
		this.gl.uniform3f( this.clr1, 1,1,1 );
		this.gl.drawArrays( this.gl.TRIANGLE_STRIP, 0, this.resCircle*2+2 );
		this.gl.drawArrays( this.gl.TRIANGLE_STRIP, this.resCircle*2+2, this.resCircle*2+2 );
		this.gl.uniform3f( this.clr1, 0,0,0 );
		this.gl.uniform3f( this.clr2, 1,1,1 );
		this.gl.drawArrays( this.gl.TRIANGLE_STRIP, this.resCircle*4+4, this.resArrow*2+2 );
		this.gl.drawArrays( this.gl.TRIANGLE_FAN, this.resCircle*4+4 + this.resArrow*2+2, this.resArrow+2 );
	}
}

// Vertex shader source code
const lightViewVS = `
	attribute vec3 pos;
	uniform mat4 mvp;
	void main()
	{
		gl_Position = mvp * vec4(pos,1);
	}
`;
// Fragment shader source code
var lightViewFS = `
	precision mediump float;
	uniform vec3 clr1;
	uniform vec3 clr2;
	void main()
	{
		gl_FragColor = gl_FrontFacing ? vec4(clr1,1) : vec4(clr2,1);
	}
`;

function LoadTexture(textureUrl, drawer) {
	fetch(textureUrl)
		.then(response => response.blob())
		.then(blob => {
			var url = URL.createObjectURL(blob);
			var img = new Image();
			img.onload = function() {
				drawer.setTexture(img);
				DrawScene();
			};
			img.src = url;
		})
		.catch(error => {
			console.error('Error loading texture:', error);
		});
}


function LoadObj(githuburl, meshDrawer) {
	fetch(githuburl)
		.then(response => response.text())
		.then(data => {
			var mesh = new ObjMesh;
			mesh.parse( data ); // Usa data per ottenere il contenuto del file
			var box = mesh.getBoundingBox();
			var shift = [
				-(box.min[0]+box.max[0])/2,
				-(box.min[1]+box.max[1])/2,
				-(box.min[2]+box.max[2])/2
			];
			var size = [
				(box.max[0]-box.min[0])/2,
				(box.max[1]-box.min[1])/2,
				(box.max[2]-box.min[2])/2
			];
			var maxSize = Math.max( size[0], size[1], size[2] );
			var scale = 1 / maxSize;
			mesh.shiftAndScale( shift, scale );
			var buffers = mesh.getVertexBuffers();
			meshDrawer.setMesh( buffers.positionBuffer, buffers.texCoordBuffer, buffers.normalBuffer );
			DrawScene();
		})
		.catch(error => {
			console.error('Fetch error:', error);
		});
}


var showBox = false;
	
window.onload = function() {
	InitWebGL();
	lightView = new LightView();
	canvas.zoom = function( s ) {
		transZ *= s/canvas.height + 1;
		UpdateProjectionMatrix();
		DrawScene();
	}
	canvas.onwheel = function() { canvas.zoom(0.3*event.deltaY); }
	canvas.onmousedown = function() {
		var cx = event.clientX;
		var cy = event.clientY;
		if ( event.ctrlKey ) {
			canvas.onmousemove = function() {
				canvas.zoom(5*(event.clientY - cy));
				cy = event.clientY;
			}
		} else {
			canvas.onmousemove = function() {
				rotY += (cx - event.clientX)/canvas.width*5;
				rotX += (cy - event.clientY)/canvas.height*5;
				cx = event.clientX;
				cy = event.clientY;
				UpdateProjectionMatrix();
				DrawScene();
			}
		}
	}
	canvas.onmouseup = canvas.onmouseleave = function() {
		canvas.onmousemove = null;
	}
	
	SetShininess( document.getElementById('shininess-exp') );
	
	DrawScene();
};

function WindowResize()
{
	UpdateCanvasSize();
	DrawScene();
}

var timer;
function AutoRotate( param )
{
	if ( param.checked ) {
		timer = setInterval( function() {
				var v = document.getElementById('rotation-speed').value;
				autorot += 0.0005 * v;
				if ( autorot > 2*Math.PI ) autorot -= 2*Math.PI;
				DrawScene();
			}, 30
		);
		document.getElementById('rotation-speed').disabled = false;
	} else {
		clearInterval( timer );
		document.getElementById('rotation-speed').disabled = true;
	}
}

function ShowTexture( param )
{
	meshDrawer.showTexture( param.checked );
	DrawScene();
}

// This is a helper function for compiling the given vertex and fragment shader source code into a program.
function InitShaderProgram( vsSource, fsSource, wgl=gl )
{
	const vs = CompileShader( wgl.VERTEX_SHADER,   vsSource, wgl );
	const fs = CompileShader( wgl.FRAGMENT_SHADER, fsSource, wgl );

	const prog = wgl.createProgram();
	wgl.attachShader(prog, vs);
	wgl.attachShader(prog, fs);
	wgl.linkProgram(prog);

	if (!wgl.getProgramParameter(prog, wgl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + wgl.getProgramInfoLog(prog));
		return null;
	}
	return prog;
}

// This is a helper function for compiling a shader, called by InitShaderProgram().
function CompileShader( type, source, wgl=gl )
{
	const shader = wgl.createShader(type);
	wgl.shaderSource(shader, source);
	wgl.compileShader(shader);
	if (!wgl.getShaderParameter( shader, wgl.COMPILE_STATUS) ) {
		alert('An error occurred compiling shader:\n' + wgl.getShaderInfoLog(shader));
		wgl.deleteShader(shader);
		return null;
	}
	return shader;
}

// Multiplies two matrices and returns the result A*B.
// The arguments A and B are arrays, representing column-major matrices.
function MatrixMult( A, B )
{
	var C = [];
	for ( var i=0; i<4; ++i ) {
		for ( var j=0; j<4; ++j ) {
			var v = 0;
			for ( var k=0; k<4; ++k ) {
				v += A[j+4*k] * B[k+4*i];
			}
			C.push(v);
		}
	}
	return C;
}

function SetShininess( param )
{
	var exp = param.value;
	var s = Math.pow(10,exp/25);
	document.getElementById('shininess-value').innerText = s.toFixed( s < 10 ? 2 : 0 );
	meshDrawer.setShininess(s);
	DrawScene();
}