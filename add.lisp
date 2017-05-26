(defun add (x y) (+ x y))
(defun dbAdd (x y)
	(add (add x x) (add y y)))
(dbAdd 22 33)

#|
var a = `
    <div class="_d aa bb xxxx" id='_d' data-aa="haha'haha">
	<div class='_d1"' id="'_d1">
        aaa
        <span class='_s' id='_s'>
            bb
            <i id="_i">
                cc
            </i>
            bb
        </span>
        <span class="_s_" id="_s_">
            _bb
            <i class="_i_">
                _cc
            </i>
            <i>
                _cc
            </i>
            _bb
        </span>
        aa
	</div>
    </div>
`;

a.match(/<(div|span|i)((\s+[\w-]+)+(=((\"[\s\w\d\"\']*\")|(\'[\s\w\d\"\']*\'))))*>/g);
|#
