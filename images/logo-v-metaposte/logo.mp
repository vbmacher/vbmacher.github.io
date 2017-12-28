prologues:=3;
outputtemplate:="%j-%c.svg";
outputformat:="svg";

def case(expr u, center_x, center_y, case_w, case_h, thick, thin, color) =
  % the main rectangle (case)
  draw unitsquare xscaled case_w yscaled case_h shifted (center_x, center_y)
    withpen pencircle scaled thick withcolor color
  ;

  % case details - dots
  dots_scale:= 2.1/10u;
  dots_x:= center_x + thick + thin;
  dots_y:= center_y + case_h / 2 - 3 * dots_scale / 2 + 1.5 * thin / 2; 
  
  for i=0 upto 2:
    for j=0 upto 2:
      draw (i,j) scaled dots_scale shifted (dots_x,dots_y)
        withpen pencircle scaled thin withcolor color
      ;
    endfor;
  endfor;

  % floppy
  floppy_w := 5/6u;
  floppy_x:= center_x + case_w - floppy_w - 3 * thin;
  floppy_y:= center_y + (case_h + thin) / 2;
  
  draw (floppy_x, floppy_y)--(floppy_x + floppy_w, floppy_y)
    withpen pensquare scaled thin withcolor color
  ;
enddef; 

def display(expr u, center_x, center_y, case_w, case_h, thick, color) =
  outer_w := 2u;
  outer_x:= center_x + (case_w - outer_w) / 2;
  outer_y:= center_y + case_h + 1.2/3u ;
      
  inner_w := outer_w - 4 * thick;
  inner_x:= outer_x + 2 * thick;
  inner_y:= outer_y + 2 * thick;

  draw unitsquare scaled outer_w shifted (outer_x, outer_y)
    withpen pencircle scaled thick withcolor color
  ;
  fill unitsquare scaled inner_w shifted (inner_x, inner_y)
    withpen pencircle scaled thick withcolor color
  ;
enddef;


def computer(expr unit, center_x, center_y, color) =
  u:= unit; % 24 = 24 bp = 1/3inch

  thick := 2/11u;
  thin := 1/7u;

  case_w := 7/2u;
  case_h := u;

  display(u, center_x, center_y, case_w, case_h, thick, color)
  case(u, center_x, center_y, case_w, case_h, thick, thin, color) 
enddef;

beginfig(1);
  big_unit   := 80;
  small_unit := 25;
  
  fill unitsquare scaled 3.7big_unit shifted (-8,-8) withcolor white;

  computer(big_unit, 0, 0, black);
  computer(small_unit, 96, 145, (green+red));
endfig;

end
